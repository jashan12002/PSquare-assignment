const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// @desc    Create leave request
// @route   POST /api/leaves
// @access  Private/HR
const createLeave = async (req, res) => {
  try {
    // Get form data from request body or form fields
    const employee = req.body.employee;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const reason = req.body.reason;
    const status = req.body.status;

    // Check if required fields are provided
    if (!employee || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if employee is active
    if (employeeExists.status !== 'Active') {
      return res.status(400).json({ message: 'Only active employees can take leave' });
    }

    // Check attendance for employee
    const attendanceExists = await Attendance.findOne({
      employee,
      status: 'Present',
    });

    if (!attendanceExists) {
      return res.status(400).json({ message: 'Only present employees can take leave' });
    }

    // Document file path if uploaded
    const documentPath = req.file ? req.file.path : '';

    // Create leave request
    const leave = await Leave.create({
      employee,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: status || 'Pending',
      document: documentPath,
    });

    // Populate employee details for response
    const populatedLeave = await Leave.findById(leave._id).populate('employee', 'name email position');

    res.status(201).json(populatedLeave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private/HR
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

// @desc    Get approved leaves
// @route   GET /api/leaves/approved
// @access  Private/HR
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

// @desc    Get leaves by employee
// @route   GET /api/leaves/employee/:id
// @access  Private/HR
const getLeavesByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    
    // Check if employee exists
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

// @desc    Update leave status
// @route   PUT /api/leaves/:id
// @access  Private/HR
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (leave) {
      leave.status = status;
      const updatedLeave = await leave.save();
      
      // Populate employee details for response
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

// @desc    Delete leave request
// @route   DELETE /api/leaves/:id
// @access  Private/HR
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