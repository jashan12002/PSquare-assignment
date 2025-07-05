const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect, hrOnly } = require('../middleware/authMiddleware');


router.get('/', protect, hrOnly, getEmployees);


router.get('/:id', protect, hrOnly, getEmployeeById);


router.put('/:id', protect, hrOnly, updateEmployee);


router.delete('/:id', protect, hrOnly, deleteEmployee);

module.exports = router; 