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


router.get('/', protect, hrOnly, getAttendance);


router.get('/employee/:id', protect, hrOnly, getAttendanceByEmployee);


router.post('/', protect, hrOnly, createAttendance);


router.put('/:id', protect, hrOnly, updateAttendance);


router.delete('/:id', protect, hrOnly, deleteAttendance);

module.exports = router; 