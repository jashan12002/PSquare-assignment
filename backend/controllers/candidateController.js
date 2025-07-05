const Candidate = require('../models/Candidate');
const Employee = require('../models/Employee');
const path = require('path');
const fs = require('fs');

const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, position, experience, status } = req.body;

    const candidateExists = await Candidate.findOne({ email });
    if (candidateExists) {
      return res.status(400).json({ message: 'Candidate already exists' });
    }

    const resumePath = req.file ? req.file.path : '';

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      position,
      experience,
      status: status || 'New',
      resume: resumePath,
    });

    if (candidate) {
      res.status(201).json(candidate);
    } else {
      res.status(400).json({ message: 'Invalid candidate data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({});
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (candidate) {
      res.json(candidate);
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
      candidate.status = status;
      const updatedCandidate = await candidate.save();
      res.json(updatedCandidate);
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {

      if (candidate.resume) {
        const filePath = path.join(__dirname, '..', candidate.resume);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      await candidate.deleteOne();
      res.json({ message: 'Candidate removed' });
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const moveToEmployee = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (candidate.status !== 'Selected') {
      return res.status(400).json({ message: 'Only selected candidates can be moved to employees' });
    }


    const employeeExists = await Employee.findOne({ email: candidate.email });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      resume: candidate.resume,
    });

    if (employee) {
     
      // await candidate.deleteOne();
      res.status(201).json(employee);
    } else {
      res.status(400).json({ message: 'Failed to create employee' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (!candidate.resume) {
      return res.status(404).json({ message: 'Resume not found for this candidate' });
    }

    const filePath = path.join(__dirname, '..', candidate.resume);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }

    const originalFilename = path.basename(candidate.resume);

    res.setHeader('Content-Disposition', `attachment; filename=${originalFilename}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidateStatus,
  deleteCandidate,
  moveToEmployee,
  downloadResume,
}; 