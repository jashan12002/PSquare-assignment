import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import ProfileAvatar from '../components/ProfileAvatar';
import apiService from '../utils/axiosConfig';
import Loader from '../components/Loader';
import SearchInput from '../components/SearchInput';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
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

  useEffect(() => {
    
    fetchData();
  }, [formData.status]);
  useEffect(() => {
    fetchData();
  }, []);


  const employeeAttendanceList = employees.map(employee => {
    
    const attendanceRecord = attendance.find(record => 
      record.employee && record.employee._id === employee._id
    );
    
    
    return {
      _id: attendanceRecord?._id || `temp-${employee._id}`,
      employee: employee,
      status: attendanceRecord?.status || 'Present',
      date: attendanceRecord?.date || new Date(),
      isNewRecord: !attendanceRecord
    };
  });

  
  const filteredAttendanceList = employeeAttendanceList.filter((record) => {
    const matchesStatus = filters.status === '' || record.status === filters.status;
    const matchesSearch = filters.search === '' || 
      record.employee?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.employee?.position.toLowerCase().includes(filters.search.toLowerCase()) ||
      record.employee?.department.toLowerCase().includes(filters.search.toLowerCase()) ||
      getEmployeeTask(record.employee).toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const toggleActions = (id) => {
    setCurrentAttendance(currentAttendance === id ? null : id);
  };

  
  const handleStatusChange = async (id, status) => {
    try {
      const record = employeeAttendanceList.find(r => r._id === id);
      
      if (record && record.isNewRecord) {
        const newAttendance = await apiService.createAttendance({
          employee: record.employee._id,
          date: new Date().toISOString().split('T')[0],
          status: status
        });
        
        setAttendance(prevAttendance => [...prevAttendance, newAttendance]);
        
       
        const updatedRecord = { ...record, status: status, isNewRecord: false };
        const updatedList = employeeAttendanceList.map(r => 
          r._id === id ? updatedRecord : r
        );
        setEmployees(prevEmployees => [...prevEmployees]); // Trigger re-render
      } else {
        const updatedAttendance = await apiService.updateAttendance(id, status);
        
        setAttendance(prevAttendance =>
          prevAttendance.map((record) =>
            record._id === id ? { ...record, status: updatedAttendance.status } : record
          )
        );
        
     
        const updatedRecord = { ...record, status: status };
        const updatedList = employeeAttendanceList.map(r => 
          r._id === id ? updatedRecord : r
        );
        setEmployees(prevEmployees => [...prevEmployees]); // Trigger re-render
      }
    } catch (error) {
      console.error('Error updating attendance status:', error);
      setError('Failed to update attendance status. Please try again later.');
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newAttendance = await apiService.createAttendance(formData);
      

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


  const getEmployeeTask = (employee) => {

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
      {loading && <Loader />}
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
              <option value="">All Status</option>
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
            <input 
              type="text" 
              placeholder="Search..." 
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
        
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
        
        {loading ? (
          <p>Loading attendance records...</p>
        ) : filteredAttendanceList.length === 0 ? (
          <table className="table" style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            marginLeft: '12px',
            tableLayout: 'fixed',
            width: '100%',
            height: '838px',
            borderCollapse: 'collapse',
            backgroundColor: 'white'
          }}>
            <thead style={{ backgroundColor: '#4D007D', color: 'white', display: 'block', width: '100%' }}>
              <tr style={{ display: 'flex', width: '100%' }}>
                <th style={{ width: '7%', padding: '16px 8px', textAlign: 'left' }}>Profile</th>
                <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Employee Name</th>
                <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Position</th>
                <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Department</th>
                <th style={{ width: '25%', padding: '16px 8px', textAlign: 'left' }}>Task</th>
                <th style={{ width: '13%', padding: '16px 8px', textAlign: 'left' }}>Status</th>
                <th style={{ width: '10%', padding: '16px 8px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ maxHeight: 'calc(838px - 53px)', overflowY: 'auto', display: 'block', width: '100%' }}>
              <tr style={{ display: 'flex', width: '100%' }}>
                {/* <td colSpan="7" style={{ padding: '20px', textAlign: 'center', width: '100%' }}>No attendance records found.</td> */}
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="table" style={{
            borderRadius: '20px',
            overflow: 'hidden',
            marginLeft: '12px',
            border: '1px solid #e5e7eb',
            tableLayout: 'fixed',
            width: '100%',
            height: '838px',
            borderCollapse: 'collapse',
            backgroundColor: 'white'
          }}>
            <thead style={{ backgroundColor: '#4D007D', color: 'white', display: 'block', width: '100%' }}>
              <tr style={{ display: 'flex', width: '100%' }}>
                <th style={{ width: '7%', padding: '16px 8px', textAlign: 'left' }}>Profile</th>
                <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Employee Name</th>
                <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Position</th>
                <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Department</th>
                <th style={{ width: '25%', padding: '16px 8px', textAlign: 'left' }}>Task</th>
                <th style={{ width: '13%', padding: '16px 8px', textAlign: 'left' }}>Status</th>
                <th style={{ width: '10%', padding: '16px 8px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ maxHeight: 'calc(838px - 53px)', overflowY: 'visible', display: 'block', width: '100%' }}>
              {filteredAttendanceList.map((record) => (
                <tr key={record._id} style={{ borderBottom: '1px solid #e5e7eb', display: 'flex', width: '100%' }}>
                  <td style={{ padding: '12px 8px', width: '7%', display: 'flex', alignItems: 'center' }}>
                    <ProfileAvatar name={record.employee?.name || 'Unknown'} size="md" />
                  </td>
                  <td style={{ padding: '12px 8px', width: '15%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.employee?.name || 'Unknown'}</td>
                  <td style={{ padding: '12px 8px', width: '15%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.employee?.position || '--'}</td>
                  <td style={{ padding: '12px 8px', width: '15%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.employee?.department || 'Designer'}</td>
                  <td style={{ padding: '12px 8px', width: '25%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getEmployeeTask(record.employee)}</td>
                  <td style={{ padding: '12px 8px', width: '13%' }}>
                    <StatusBadge 
                      status={record.status} 
                      onStatusChange={handleStatusChange}
                      id={record._id}
                      type="attendance"
                    />
                  </td>
                  <td style={{ padding: '12px 8px', width: '10%' }}>
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