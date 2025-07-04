const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect, hrOnly } = require('../middleware/authMiddleware');

// Get all employees
router.get('/', protect, hrOnly, getEmployees);

// Get employee by ID
router.get('/:id', protect, hrOnly, getEmployeeById);

// Update employee
router.put('/:id', protect, hrOnly, updateEmployee);

// Delete employee
router.delete('/:id', protect, hrOnly, deleteEmployee);

module.exports = router; 