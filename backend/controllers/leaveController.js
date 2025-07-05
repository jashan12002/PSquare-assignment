const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');


const createLeave = async (req, res) => {
  try {
 
    const employee = req.body.employee;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const reason = req.body.reason;
    const status = req.body.status;


    if (!employee || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }


    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({ message: 'Employee not found' });
    }


    if (employeeExists.status !== 'Active') {
      return res.status(400).json({ message: 'Only active employees can take leave' });
    }


    const attendanceExists = await Attendance.findOne({
      employee,
      status: 'Present',
    });

    if (!attendanceExists) {
      return res.status(400).json({ message: 'Only present employees can take leave' });
    }

    const documentPath = req.file ? req.file.path : '';

    const leave = await Leave.create({
      employee,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: status || 'Pending',
      document: documentPath,
    });

    const populatedLeave = await Leave.findById(leave._id).populate('employee', 'name email position');

    res.status(201).json(populatedLeave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({})
      .populate('employee', 'name email position')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getApprovedLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'Approved' })
      .populate('employee', 'name email position')
      .sort({ startDate: 1 });
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeavesByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
  
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const leaves = await Leave.find({ employee: employeeId })
      .sort({ createdAt: -1 });
      
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (leave) {
      leave.status = status;
      const updatedLeave = await leave.save();
   
      const populatedLeave = await Leave.findById(updatedLeave._id).populate('employee', 'name email position');
      
      res.json(populatedLeave);
    } else {
      res.status(404).json({ message: 'Leave request not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (leave) {
      await leave.deleteOne();
      res.json({ message: 'Leave request removed' });
    } else {
      res.status(404).json({ message: 'Leave request not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createLeave,
  getLeaves,
  getApprovedLeaves,
  getLeavesByEmployee,
  updateLeaveStatus,
  deleteLeave,
}; 