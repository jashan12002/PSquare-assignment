import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import ProfileAvatar from '../components/ProfileAvatar';
import apiService from '../utils/axiosConfig';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    position: '',
  });
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joinDate: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // Current month and year for calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiService.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to load employees. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    return (
      filters.position === '' || employee.position === filters.position
    );
  });

  // Get unique positions for filter
  const positions = [...new Set(employees.map((employee) => employee.position))];

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle actions dropdown
  const toggleActions = (id) => {
    setCurrentEmployee(currentEmployee === id ? null : id);
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date to MM/DD/YY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().substring(2)}`;
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // Open edit modal
  const handleEditClick = (employee) => {
    setEditEmployee({
      ...employee,
      joinDate: formatDateForInput(employee.joinDate)
    });
    setCurrentDate(new Date(employee.joinDate));
    setShowEditModal(true);
    setCurrentEmployee(null);
  };

  // Handle edit input change
  const handleEditInputChange = (e) => {
    setEditEmployee({
      ...editEmployee,
      [e.target.name]: e.target.value
    });
  };

  // Calendar navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    
    setEditEmployee({
      ...editEmployee,
      joinDate: formatDateForInput(selectedDate)
    });
    
    setShowCalendar(false);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = editEmployee.joinDate === formatDateForInput(date);
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  // Validate edit form
  const validateEditForm = () => {
    let errors = {};
    let isValid = true;

    if (!editEmployee.name) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!editEmployee.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(editEmployee.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!editEmployee.phone) {
      errors.phone = 'Phone number is required';
      isValid = false;
    }

    if (!editEmployee.position) {
      errors.position = 'Position is required';
      isValid = false;
    }

    if (!editEmployee.department) {
      errors.department = 'Department is required';
      isValid = false;
    }

    if (!editEmployee.joinDate) {
      errors.joinDate = 'Join date is required';
      isValid = false;
    }

    setEditErrors(errors);
    return isValid;
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    try {
      const updatedEmployee = await apiService.updateEmployee(editEmployee._id, {
        name: editEmployee.name,
        email: editEmployee.email,
        phone: editEmployee.phone,
        position: editEmployee.position,
        department: editEmployee.department,
        joinDate: editEmployee.joinDate
      });

      setEmployees(employees.map(emp => 
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      ));
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Failed to update employee. Please try again later.');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await apiService.deleteEmployee(id);
        setEmployees(employees.filter(employee => employee._id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
        setError('Failed to delete employee. Please try again later.');
      }
    }
  };

  // Get month name
  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  return (
    <div>
      <Header title="Employees" />
      
      <div className="card">
        <div className="filters">
          <div className="filter-select">
            <select 
              name="position" 
              value={filters.position} 
              onChange={handleFilterChange}
              className="input-select"
            >
              <option value="">Position</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          <div className="header-search">
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </p>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
        
        {loading ? (
          <p>Loading employees...</p>
        ) : filteredEmployees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <table className="table"  style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            tableLayout: 'fixed',
            width: '100%'
          }}>
            <thead>
              <tr>
                <th style={{ width: '7%' }}>Profile</th>
                <th style={{ width: '15%' }}>Employee Name</th>
                <th style={{ width: '20%' }}>Email Address</th>
                <th style={{ width: '12%' }}>Phone Number</th>
                <th style={{ width: '12%' }}>Position</th>
                <th style={{ width: '12%' }}>Department</th>
                <th style={{ width: '12%' }}>Date of Joining</th>
                <th style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee._id}>
                  <td>
                    <ProfileAvatar name={employee.name} size="md" />
                  </td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.name}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.email}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.phone}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.position}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.department || 'Designer'}</td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatDate(employee.joinDate)}</td>
                  <td>
                    <div className="actions-menu">
                      <button
                        className="actions-toggle"
                        onClick={() => toggleActions(employee._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </button>
                      
                      {currentEmployee === employee._id && (
                        <div className="actions-dropdown">
                          <div 
                            className="actions-item"
                            onClick={() => handleEditClick(employee)}
                          >
                            Edit
                          </div>
                          <div 
                            className="actions-item"
                            onClick={() => handleDelete(employee._id)}
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal" style={{borderRadius: '21px 21px 0px 0px'}}>
            <div className="modal-header" style={{backgroundColor: '#4D007D', color: 'white', fontWeight: '500'}}>
              <div> </div>
              <h3 className="modal-title" style={{color: 'white', fontWeight: '500'}}>Edit Employee Details</h3>
              <button className="modal-close" style={{color: 'white', fontWeight: '500'}} onClick={() => setShowEditModal(false)}>
                &times;
              </button>
            </div>

            <div className="modal-body" style={{backgroundColor: 'white'}}>
              <form onSubmit={handleEditSubmit}>
                <div className="form-row">
                  <div className="floating-label-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editEmployee.name}
                      onChange={handleEditInputChange}
                      placeholder=" "
                    />
                    <label htmlFor="name">Full Name*</label>
                    {editErrors.name && (
                      <div className="form-error">{editErrors.name}</div>
                    )}
                  </div>

                  <div className="floating-label-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editEmployee.email}
                      onChange={handleEditInputChange}
                      placeholder=" "
                    />
                    <label htmlFor="email">Email Address*</label>
                    {editErrors.email && (
                      <div className="form-error">{editErrors.email}</div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="floating-label-group">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={editEmployee.phone}
                      onChange={handleEditInputChange}
                      placeholder=" "
                    />
                    <label htmlFor="phone">Phone Number*</label>
                    {editErrors.phone && (
                      <div className="form-error">{editErrors.phone}</div>
                    )}
                  </div>

                  <div className="floating-label-group">
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={editEmployee.department}
                      onChange={handleEditInputChange}
                      placeholder=" "
                    />
                    <label htmlFor="department">Department*</label>
                    {editErrors.department && (
                      <div className="form-error">{editErrors.department}</div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="floating-label-group">
                    <select
                      id="position"
                      name="position"
                      value={editEmployee.position}
                      onChange={handleEditInputChange}
                      className="input-select"
                    >
                      <option value="">Select Position</option>
                      <option value="Intern">Intern</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Manager">Manager</option>
                    </select>
                    <label htmlFor="position">Position*</label>
                    {editErrors.position && (
                      <div className="form-error">{editErrors.position}</div>
                    )}
                  </div>

                  <div className="floating-label-group">
                    <div className="date-input-container">
                      <input
                        type="text"
                        id="joinDate"
                        name="joinDate"
                        value={editEmployee.joinDate}
                        onChange={handleEditInputChange}
                        onClick={() => setShowCalendar(!showCalendar)}
                        readOnly
                        placeholder=" "
                      />
                      <label htmlFor="joinDate">Date of Joining*</label>
                      <div className="date-icon" onClick={() => setShowCalendar(!showCalendar)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      
                      {showCalendar && (
                        <div className="calendar-popup" ref={calendarRef}>
                          <div className="calendar-header">
                            <button type="button" className="calendar-nav" onClick={prevMonth}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                              </svg>
                            </button>
                            <div className="calendar-title">
                              {getMonthName(currentDate.getMonth())}, {currentDate.getFullYear()}
                            </div>
                            <button type="button" className="calendar-nav" onClick={nextMonth}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                            </button>
                          </div>
                          <div className="calendar-weekdays">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                          </div>
                          <div className="calendar-days">
                            {generateCalendarDays()}
                          </div>
                        </div>
                      )}
                    </div>
                    {editErrors.joinDate && (
                      <div className="form-error">{editErrors.joinDate}</div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees; 