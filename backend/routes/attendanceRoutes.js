const express = require('express');
const router = express.Router();
const {
  createAttendance,
  getAttendance,
  getAttendanceByEmployee,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');
const { protect, hrOnly } = require('../middleware/authMiddleware');

// Get all attendance records
router.get('/', protect, hrOnly, getAttendance);

// Get attendance by employee
router.get('/employee/:id', protect, hrOnly, getAttendanceByEmployee);

// Create attendance record
router.post('/', protect, hrOnly, createAttendance);

// Update attendance record
router.put('/:id', protect, hrOnly, updateAttendance);

// Delete attendance record
router.delete('/:id', protect, hrOnly, deleteAttendance);

module.exports = router; 