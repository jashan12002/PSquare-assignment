const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/HR
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private/HR
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/HR
const updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, position, status, department, joinDate } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.name = name || employee.name;
      employee.email = email || employee.email;
      employee.phone = phone || employee.phone;
      employee.position = position || employee.position;
      employee.status = status || employee.status;
      employee.department = department || employee.department;
      
      // Update join date if provided
      if (joinDate) {
        employee.joinDate = joinDate;
      }

      // Update resume if new file is uploaded
      if (req.file) {
        employee.resume = req.file.path;
      }

      const updatedEmployee = await employee.save();
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private/HR
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      await employee.deleteOne();
      res.json({ message: 'Employee removed' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
}; 