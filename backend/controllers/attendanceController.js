const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private/HR
const createAttendance = async (req, res) => {
  try {
    const { employee, date, status } = req.body;

    // Check if employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if employee is active
    if (employeeExists.status !== 'Active') {
      return res.status(400).json({ message: 'Can only add attendance for active employees' });
    }

    // Check if attendance record already exists for this date
    const attendanceExists = await Attendance.findOne({
      employee,
      date: new Date(date),
    });

    if (attendanceExists) {
      return res.status(400).json({ message: 'Attendance record already exists for this date' });
    }

    // Create attendance
    const attendance = await Attendance.create({
      employee,
      date: new Date(date),
      status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private/HR
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({})
      .populate('employee', 'name email position')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get attendance by employee
// @route   GET /api/attendance/employee/:id
// @access  Private/HR
const getAttendanceByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    
    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const attendance = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 });
      
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/HR
const updateAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (attendance) {
      attendance.status = status || attendance.status;
      const updatedAttendance = await attendance.save();
      res.json(updatedAttendance);
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/HR
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (attendance) {
      await attendance.deleteOne();
      res.json({ message: 'Attendance record removed' });
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  getAttendanceByEmployee,
  updateAttendance,
  deleteAttendance,
}; 