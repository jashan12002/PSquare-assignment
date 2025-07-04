import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import ProfileAvatar from '../components/ProfileAvatar';
import apiService from '../utils/axiosConfig';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
  });
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [formData, setFormData] = useState({
    employee: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });

  const fetchData = async () => {
    try {
      const [attendanceData, employeesData] = await Promise.all([
        apiService.getAttendance(),
        apiService.getEmployees()
      ]);
      
      setAttendance(attendanceData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance records and employees
  useEffect(() => {
    
    fetchData();
  }, [formData.status]);
  useEffect(() => {
    fetchData();
  }, []);

  // Create a combined list of employees with their attendance status
  const employeeAttendanceList = employees.map(employee => {
    // Find attendance record for this employee (if exists)
    const attendanceRecord = attendance.find(record => 
      record.employee && record.employee._id === employee._id
    );
    
    // Return employee with attendance status
    return {
      _id: attendanceRecord?._id || `temp-${employee._id}`,
      employee: employee,
      status: attendanceRecord?.status || 'Present',
      date: attendanceRecord?.date || new Date(),
      isNewRecord: !attendanceRecord
    };
  });

  // Filter attendance records
  const filteredAttendanceList = employeeAttendanceList.filter((record) => {
    return (
      filters.status === '' || record.status === filters.status
    );
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle actions dropdown
  const toggleActions = (id) => {
    setCurrentAttendance(currentAttendance === id ? null : id);
  };

  // Handle status change
  const handleStatusChange = async (id, status) => {
    try {
      // Check if this is a new record
      const record = employeeAttendanceList.find(r => r._id === id);
      
      if (record && record.isNewRecord) {
        // Create new attendance record
        const newAttendance = await apiService.createAttendance({
          employee: record.employee._id,
          date: new Date().toISOString().split('T')[0],
          status: status
        });
        
        // Update attendance list
        setAttendance([...attendance, newAttendance]);
      } else {
        // Update existing record
        const updatedAttendance = await apiService.updateAttendance(id, status);
        setAttendance(
          attendance.map((record) =>
            record._id === id ? { ...record, status: updatedAttendance.status } : record
          )
        );
      }
    } catch (error) {
      console.error('Error updating attendance status:', error);
      setError('Failed to update attendance status. Please try again later.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newAttendance = await apiService.createAttendance(formData);
      
      // Find the employee data
      const employee = employees.find(emp => emp._id === formData.employee);
      
      setAttendance([
        ...attendance,
        {
          ...newAttendance,
          employee
        }
      ]);
      
      setFormData({
        employee: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
      
      setShowModal(false);
    } catch (error) {
      console.error('Error creating attendance record:', error);
      setError('Failed to create attendance record. Please try again later.');
    }
  };

  // Get task for employee
  const getEmployeeTask = (employee) => {
    // This would ideally come from a tasks API
    // For now, using hardcoded tasks based on position
    const tasks = {
      'Designer': 'Dashboard Home page Alignment',
      'Full Time': 'Dashboard Login page design, Dashboard Home page design',
      'Senior': '--',
      'Junior': 'Dashboard login page integration',
      'Team Lead': '4 scheduled interview, Sorting of resumes'
    };
    
    return tasks[employee?.position] || '--';
  };

  return (
    <div>
      <Header title="Attendance" />
      
      <div className="card">
        <div className="filters">
          <div className="filter-select">
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
              className="input-select"
            >
              <option value="">Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Work From Home">Work From Home</option>
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
          <p>Loading attendance records...</p>
        ) : filteredAttendanceList.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table className="table" style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            tableLayout: 'fixed',
            width: '100%'
          }}>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Task</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendanceList.map((record) => (
                <tr key={record._id}>
                  <td>
                    <ProfileAvatar name={record.employee?.name || 'Unknown'} size="md" />
                  </td>
                  <td>{record.employee?.name || 'Unknown'}</td>
                  <td>{record.employee?.position || '--'}</td>
                  <td>{record.employee?.department || 'Designer'}</td>
                  <td style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{getEmployeeTask(record.employee)}</td>
                  <td>
                    <StatusBadge 
                      status={record.status} 
                      onStatusChange={handleStatusChange}
                      id={record._id}
                      type="attendance"
                    />
                  </td>
                  <td>
                    <div className="actions-menu">
                      <button
                        className="actions-toggle"
                        onClick={() => toggleActions(record._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </button>
                      
                      {currentAttendance === record._id && (
                        <div className="actions-dropdown">
                          <div className="actions-item">
                            View Details
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
      
      {/* Mark Attendance Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header" style={{backgroundColor: '#6d28d9', color: 'white', fontWeight: '500'}}>
              <h3 className="modal-title" style={{color: 'white', fontWeight: '500'}}>Mark Attendance</h3>
              <button className="modal-close" style={{color: 'white', fontWeight: '500'}} onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <div className="modal-body" style={{backgroundColor: 'white'}}>
              <form onSubmit={handleSubmit}>
                <div className="floating-label-group">
                  <select
                    id="employee"
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="employee">Employee*</label>
                </div>

                <div className="floating-label-group">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="date">Date*</label>
                </div>

                <div className="floating-label-group">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                   
                  </select>
                  <label htmlFor="status">Status*</label>
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

export default Attendance; 