const Candidate = require('../models/Candidate');
const Employee = require('../models/Employee');
const path = require('path');
const fs = require('fs');

// @desc    Create a new candidate
// @route   POST /api/candidates
// @access  Private/HR
const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, position, experience, status } = req.body;

    // Check if candidate already exists
    const candidateExists = await Candidate.findOne({ email });
    if (candidateExists) {
      return res.status(400).json({ message: 'Candidate already exists' });
    }

    // Resume file path if uploaded
    const resumePath = req.file ? req.file.path : '';

    // Create new candidate
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

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private/HR
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({});
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private/HR
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

// @desc    Update candidate status
// @route   PUT /api/candidates/:id
// @access  Private/HR
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

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private/HR
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
      // Delete resume file if exists
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

// @desc    Move candidate to employee
// @route   POST /api/candidates/:id/hire
// @access  Private/HR
const moveToEmployee = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (candidate.status !== 'Selected') {
      return res.status(400).json({ message: 'Only selected candidates can be moved to employees' });
    }

    // Check if employee already exists with this email
    const employeeExists = await Employee.findOne({ email: candidate.email });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    // Create new employee from candidate data
    const employee = await Employee.create({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      resume: candidate.resume,
    });

    if (employee) {
      // Delete the candidate after successful move
      await candidate.deleteOne();
      res.status(201).json(employee);
    } else {
      res.status(400).json({ message: 'Failed to create employee' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Download candidate resume
// @route   GET /api/candidates/:id/resume
// @access  Private/HR
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

    // Get original filename from path
    const originalFilename = path.basename(candidate.resume);
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${originalFilename}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Create read stream and pipe to response
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