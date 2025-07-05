import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import ProfileAvatar from '../components/ProfileAvatar';
import apiService from '../utils/axiosConfig';
import Loader from '../components/Loader';
import SearchInput from '../components/SearchInput';
import {
  formatDate,
  formatShortDate,
  getMonthAndYear,
  getDaysInMonth,
  getFirstDayOfMonth,
  isDateInRange
} from '../utils/formatDate';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [presentEmployees, setPresentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentLeave, setCurrentLeave] = useState(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [formData, setFormData] = useState({
    employee: '',
    employeeName: '',
    designation: '',
    leaveDate: new Date().toISOString().split('T')[0],
    reason: '',
    document: null
  });
  const [formErrors, setFormErrors] = useState({});

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);
  const datePickerRef = useRef(null);

  // Dropdown state
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // Download state
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch leave records, employees, and attendance
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leavesData, approvedLeavesData, employeesData, attendanceData] = await Promise.all([
          apiService.getLeaves(),
          apiService.getApprovedLeaves(),
          apiService.getEmployees(),
          apiService.getAttendance()
        ]);

        // Filter employees who are present
        const presentEmployeeIds = attendanceData
          .filter(record => record.status === 'Present')
          .map(record => record.employee?._id);

        const presentEmployeesList = employeesData.filter(employee =>
          presentEmployeeIds.includes(employee._id)
        );

        setLeaves(leavesData);
        setApprovedLeaves(approvedLeavesData);
        setEmployees(employeesData);
        setPresentEmployees(presentEmployeesList);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter leave records
  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = filters.status === '' || leave.status === filters.status;
    const matchesSearch = filters.search === '' || 
      leave.employee?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      leave.employee?.position.toLowerCase().includes(filters.search.toLowerCase()) ||
      leave.reason.toLowerCase().includes(filters.search.toLowerCase()) ||
      leave.status.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesSearch;
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

  // Handle employee selection
  const handleEmployeeSelect = (employeeId, employeeName, employeePosition) => {
    setFormData({
      ...formData,
      employee: employeeId,
      employeeName: employeeName,
      designation: employeePosition || '',
    });
  };

  // Clear employee selection
  const clearEmployeeSelection = () => {
    setFormData({
      ...formData,
      employee: '',
      employeeName: '',
      designation: '',
    });
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    setFormData({
      ...formData,
      leaveDate: formattedDate,
    });
    setSelectedDate(date);
    setShowCalendar(false);
  };

  // Toggle date picker calendar
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  // Toggle actions dropdown
  const toggleActions = (id) => {
    setCurrentLeave(currentLeave === id ? null : id);
  };

  // Handle status change
  const handleStatusChange = async (id, status) => {
    try {
      const updatedLeave = await apiService.updateLeaveStatus(id, status);

      // Update leaves list
      setLeaves(
        leaves.map((leave) =>
          leave._id === id ? { ...leave, status: updatedLeave.status } : leave
        )
      );

      // Update approved leaves if status is Approved
      if (status === 'Approved') {
        setApprovedLeaves([...approvedLeaves, updatedLeave]);
      } else {
        setApprovedLeaves(approvedLeaves.filter(leave => leave._id !== id));
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
      setError('Failed to update leave status. Please try again later.');
    }
  };

  // Validate form
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.employee) {
      errors.employee = 'Employee is required';
      isValid = false;
    }

    if (!formData.leaveDate) {
      errors.leaveDate = 'Leave date is required';
      isValid = false;
    }

    if (!formData.reason) {
      errors.reason = 'Reason is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle document upload
  const handleDocumentUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        document: e.target.files[0]
      });
    }
  };

  // Handle document download
  const handleDocumentDownload = async (documentPath) => {
    if (!documentPath) return;
    
    try {
      setIsDownloading(true);
      console.log('Document path:', documentPath);
      
      // Don't modify the path - let the service handle different formats
      await apiService.downloadLeaveDocument(documentPath);
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Failed to download document. Please try again later.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData object for file upload
      const leaveFormData = new FormData();
      leaveFormData.append('employee', formData.employee);
      leaveFormData.append('startDate', formData.leaveDate);
      leaveFormData.append('endDate', formData.leaveDate); // Single day leave
      leaveFormData.append('reason', formData.reason);

      if (formData.document) {
        leaveFormData.append('document', formData.document);
      }

      const newLeave = await apiService.createLeave(leaveFormData);

      // No need to find employee data as it's already populated in the response
      setLeaves([...leaves, newLeave]);

      // Reset form
      setFormData({
        employee: '',
        employeeName: '',
        designation: '',
        leaveDate: new Date().toISOString().split('T')[0],
        reason: '',
        document: null
      });

      setShowModal(false);
    } catch (error) {
      console.error('Error creating leave record:', error);
      setError('Failed to create leave record. Please try again later.');
    }
  };

  // Calendar navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedCalendarDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedCalendarDate(null);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const generateCalendarDays = (options = {}) => {
    const {
      clickable = false,
      highlightSelected = false,
      leavesForIndicator = approvedLeaves,
      isModal = false,
    } = options;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];


    for (let i = 0; i < firstDayOfMonth; i++) {
      if (isModal) {
        days.push(<div key={`empty-${i}`} style={{ width: '40px', height: '40px' }}></div>);
      } else {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
      }
    }


    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = isModal ? 
        (highlightSelected && selectedDate && new Date(selectedDate).toDateString() === date.toDateString()) :
        (selectedCalendarDate && selectedCalendarDate.toDateString() === date.toDateString());
      const leavesOnDay = leavesForIndicator.filter(leave => formatShortDate(leave.startDate) === formatShortDate(date));
      const hasLeaves = leavesOnDay.length > 0;


      let cellStyle;

      if (isModal) {

        cellStyle = {
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '50%',
          backgroundColor: isSelected ? '#4D007D' : 'transparent',
          color: isSelected ? 'white' : 'inherit',
          fontSize: '14px',
          position: 'relative',
        };

        if (day === 8) {
          cellStyle.backgroundColor = '#f3f0f8';
          cellStyle.border = '1px solid #4D007D';
          cellStyle.borderRadius = '2px';
        }
      } else {

        cellStyle = {
          position: 'relative',
          padding: '10px',
          width: '55px',
          height: '66px',
          minHeight: '60px',
          border: hasLeaves ? '1.5px solid #4d007d' : '1px solid #e5e7eb',
          backgroundColor: hasLeaves ? '#f0f0f0' : 'transparent',
          borderRadius: '5px',
          cursor: hasLeaves ? 'pointer' : 'default',
          color: isSelected ? '#4d007d' : '#222',
          // outline: isSelected ? '2px solid #4D007D' : 'none',
          zIndex: 1,
        };
      }

      days.push(
        <div
          key={`day-${day}`}
          style={cellStyle}
          onClick={() => {
            if (isModal) {
              handleDateSelect(date);
            } else if (hasLeaves) {
              setSelectedCalendarDate(date);
            }
          }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>{day}</span>
          {hasLeaves && !isModal && (
            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#4D007D',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              zIndex: 3,
              fontWeight: 'bold'
            }}>
              {leavesOnDay.length}
            </div>
          )}
          {hasLeaves && isModal && day === 8 && (
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#4D007D',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              zIndex: 3,
              fontWeight: 'bold'
            }}>
              1
            </div>
          )}
        </div>
      );
    }
    return days;
  };


  const filteredApprovedLeaves = selectedCalendarDate
    ? approvedLeaves.filter(leave => formatShortDate(leave.startDate) === formatShortDate(selectedCalendarDate))
    : approvedLeaves;

  return (
    <div className="leaves-container">
      {(loading || isDownloading) && <Loader />}
      <Header title="Leaves" />

      <div className="filters ">
        <div className="filter-select">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input-select"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>

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
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Leave
          </button>
        </div>

      </div>

      <div className="leaves-content">

        <div className="card applied-leaves">


          {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}


          {loading ? (
            <p>Loading leave records...</p>
          ) : filteredLeaves.length === 0 ? (
            <table className="table" style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              tableLayout: 'fixed',
              marginLeft: '12px',
              width: '572px',
              height: '838px',
              borderCollapse: 'collapse',
              backgroundColor: 'white'
            }}>
              <thead style={{ backgroundColor: '#4D007D', color: 'white', display: 'block', width: '100%' }}>
                <tr style={{ display: 'flex', width: '100%' }}>
                  <th style={{ width: '10%', padding: '16px 8px', textAlign: 'left' }}>Profile</th>
                  <th style={{ width: '20%', padding: '16px 8px', textAlign: 'left' }}>Name</th>
                  <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Date</th>
                  <th style={{ width: '25%', padding: '16px 8px', textAlign: 'left' }}>Reason</th>
                  <th style={{ width: '20%', padding: '16px 8px', textAlign: 'left' }}>Status</th>
                  <th style={{ width: '10%', padding: '16px 8px', textAlign: 'left' }}>Docs</th>
                </tr>
              </thead>
              <tbody style={{ maxHeight: 'calc(838px - 53px)', overflowY: 'visible',  display: 'block', width: '100%' }}>
                <tr style={{ display: 'flex', width: '100%' }}>
                  {/* <td colSpan="6" style={{ padding: '20px', textAlign: 'center', width: '100%' }}>No leave records found.</td> */}
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="table" style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              tableLayout: 'fixed',
              width: '100%',
              height: '838px',
              borderCollapse: 'collapse',
              backgroundColor: 'white'
            }}>
              <thead style={{ backgroundColor: '#4D007D', color: 'white', display: 'block', width: '100%' }}>
                <tr style={{ display: 'flex', width: '100%' }}>
                  <th style={{ width: '10%', padding: '16px 8px', textAlign: 'left' }}>Profile</th>
                  <th style={{ width: '20%', padding: '16px 8px', textAlign: 'left' }}>Name</th>
                  <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Date</th>
                  <th style={{ width: '25%', padding: '16px 8px', textAlign: 'left' }}>Reason</th>
                  <th style={{ width: '20%', padding: '16px 8px', textAlign: 'left' }}>Status</th>
                  <th style={{ width: '10%', padding: '16px 8px', textAlign: 'left' }}>Docs</th>
                </tr>
              </thead>
              <tbody style={{ maxHeight: 'calc(838px - 53px)', overflowY: 'visible', display: 'block', width: '100%', fontSize: '15px' }}>
                {filteredLeaves.map((leave) => (
                  <tr key={leave._id} style={{ borderBottom: '1px solid #e5e7eb', display: 'flex', width: '100%' }}>
                    <td style={{ padding: '12px 8px', width: '10%', display: 'flex', alignItems: 'center' }}>
                      <ProfileAvatar name={leave.employee?.name || 'Unknown'} size="md" />
                    </td>
                    <td style={{ padding: '12px 8px', width: '20%' }}>
                      <div>
                        <p style={{ fontSize: '16px', margin: '0' }}>{leave.employee?.name || 'Unknown'}</p>
                        <div className="employee-position" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leave.employee?.position || ''}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', width: '15%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatShortDate(leave.startDate)}</td>
                    <td style={{ padding: '12px 8px', width: '25%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leave.reason}</td>
                    <td style={{ padding: '12px 8px', width: '20%' }}>
                      <StatusBadge
                        status={leave.status}
                        onStatusChange={handleStatusChange}
                        id={leave._id}
                        type="leave"
                      />
                    </td>
                    <td style={{ padding: '12px 8px', width: '10%' }}>
                      {leave.document ? (
                        <button 
                          onClick={() => handleDocumentDownload(leave.document)}
                          disabled={isDownloading}
                          style={{ 
                            background: 'none',
                            border: 'none',
                            cursor: isDownloading ? 'wait' : 'pointer',
                            padding: 0
                          }}
                        >
                          <svg width="13" height="18" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H13C14.1046 19 15 18.1046 15 17V7M9 1L15 7M9 1V6C9 6.55228 9.44772 7 10 7H15" stroke="#4d007d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      ) : (
                        <svg width="13" height="18" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H13C14.1046 19 15 18.1046 15 17V7M9 1L15 7M9 1V6C9 6.55228 9.44772 7 10 7H15" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>


        <div className="card leave-calendar">

          <div style={{ backgroundColor: '#4D007D', color: 'white', padding: '10px', borderRadius: '20px 20px 0px 0px' }}>


            <h3 className="" style={{ fontSize: '20px', fontWeight: '200' }}>Leave Calendar</h3>

          </div>
          <div className="calendar-container">
            <div className="calendar-header">
              <button type="button" className="calendar-nav" onClick={prevMonth}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div className="calendar-title">
                {getMonthAndYear(currentDate)}
              </div>
              <button type="button" className="calendar-nav" onClick={nextMonth}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <div className="calendar-weekdays">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>

            <div className="calendar-days">
              {generateCalendarDays({ clickable: false, highlightSelected: false, leavesForIndicator: approvedLeaves })}
            </div>


            <div className="approved-leaves" style={{ marginTop: '20px' }}>
              <h4 style={{ fontWeight: '500', marginBottom: '15px', fontSize: '16px' }}>
                Approved Leaves
              </h4>

              {filteredApprovedLeaves.length === 0 ? (
                <p>No approved leaves {selectedCalendarDate ? 'for this date' : ''}</p>
              ) : (
                <ul className="approved-leaves-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {filteredApprovedLeaves.map(leave => (
                    <li key={leave._id} className="approved-leave-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <ProfileAvatar name={leave.employee?.name || 'Unknown'} size="sm" />
                      <div className="approved-leave-details" style={{ marginLeft: '10px', flex: 1 }}>
                        <div className="approved-leave-name" style={{ fontWeight: '500' }}>{leave.employee?.name}</div>
                        <div className="approved-leave-position" style={{ fontSize: '12px', color: '#6b7280' }}>{leave.employee?.position}</div>
                      </div>
                      <div className="approved-leave-date" style={{ fontSize: '14px' }}>{formatShortDate(leave.startDate)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>


      {showModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal new-leave-modal" style={{
            width: '900px',
            backgroundColor: 'white',
            borderRadius: '26px',
            overflow: 'visible',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div className="modal-header" style={{
              backgroundColor: '#4D007D',
              color: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>

              </div>
              <h3 className="modal-title" style={{
                color: 'white',
                margin: 0,
                fontSize: '20px',
                fontWeight: '500'
              }}>Add New Leave</h3>
              <button className="modal-close" style={{
                color: 'white',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }} onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body" style={{
              padding: '30px',
              backgroundColor: 'white',
              borderRadius: '12px'

            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value={formData.employeeName || ''}
                        placeholder="Jane Cooper"
                        style={{
                          width: '100%',
                          padding: '14px 20px',
                          border: '1px solid #4d007d',
                          borderRadius: '12px',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                        readOnly
                        onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                        required
                      />
                      {formData.employeeName && (
                        <button
                          type="button"
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            color: '#666',
                            cursor: 'pointer'
                          }}
                          onClick={clearEmployeeSelection}
                        >
                          ×
                        </button>
                      )}
                    </div>


                    {showEmployeeDropdown && (
                      <div className="employee-dropdown" style={{
                        position: 'absolute',
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        zIndex: 100,
                        marginTop: '5px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}>
                        {presentEmployees.length === 0 ? (
                          <div className="no-employees" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>No present employees available</div>
                        ) : (
                          <ul className="employee-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {presentEmployees.map((employee) => (
                              <li
                                key={employee._id}
                                className="employee-item"
                                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}
                                onClick={() => {
                                  handleEmployeeSelect(employee._id, employee.name, employee.position);
                                  setShowEmployeeDropdown(false);
                                }}
                              >
                                <ProfileAvatar name={employee.name} size="sm" />
                                <div className="employee-info" style={{ marginLeft: '10px' }}>
                                  <div className="employee-name" style={{ fontWeight: 'bold' }}>{employee.name}</div>
                                  <div className="employee-position" style={{ fontSize: '12px', color: '#666' }}>{employee.position}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        id="designation"
                        name="designation"
                        value={formData.designation || 'Full Time Designer'}
                        placeholder="Designation"
                        style={{
                          width: '100%',
                          padding: '14px 20px',
                          border: '1px solid #4d007d',
                          borderRadius: '12px',
                          fontSize: '16px',
                          backgroundColor: '#f9fafb',
                          boxSizing: 'border-box'
                        }}
                        readOnly
                      />
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '15px',
                        fontSize: '12px',
                        backgroundColor: 'white',
                        padding: '0 5px',
                        color: '#4d007d'
                      }}>Designation*</span>
                    </div>
                  </div>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                  <div className="form-group" style={{ flex: 1, position: 'relative' }}>
                    <div className="date-input-wrapper" style={{ position: 'relative' }}>
                      <input
                        type="text"
                        id="leaveDate"
                        name="leaveDate"
                        value={formatShortDate(formData.leaveDate)}
                        placeholder="Leave Date"
                        onClick={toggleCalendar}
                        style={{
                          width: '100%',
                          padding: '14px 20px',
                          paddingRight: '40px',
                          border: '1px solid #4d007d',
                          borderRadius: '12px',
                          fontSize: '16px',
                          cursor: 'pointer',
                          boxSizing: 'border-box'
                        }}
                        readOnly
                        required
                      />
                      <button type="button" className="calendar-toggle" onClick={toggleCalendar} style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 7H1M4 1V3M14 1V3M13 13.5C13 14.3284 12.3284 15 11.5 15C10.6716 15 10 14.3284 10 13.5C10 12.6716 10.6716 12 11.5 12C12.3284 12 13 12.6716 13 13.5ZM3 19H15C16.1046 19 17 18.1046 17 17V5C17 3.89543 16.1046 3 15 3H3C1.89543 3 1 3.89543 1 5V17C1 18.1046 1.89543 19 3 19Z" stroke="#4d007d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      </button>
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '15px',
                        fontSize: '12px',
                        backgroundColor: 'white',
                        padding: '0 5px',
                        color: '#4d007d'
                      }}>Leave Date*</span>
                    </div>

                    {showCalendar && (
                      <div className="date-picker-calendar" ref={datePickerRef} style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0px',
                        zIndex: '100',
                        width: '400px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        marginTop: '10px',
                        boxShadow: '3px 3px 52px 5px rgba(177,177,177,0.75)',
                        WebkitBoxShadow: '3px 3px 52px 5px rgba(177,177,177,0.75)',
                        MozBoxShadow: '3px 3px 52px 5px rgba(177,177,177,0.75)',
                        padding: '2px',
                        overflow: 'hidden'
                      }}>
                        <div className="calendar-header" style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '10px'
                        }}>
                          <button type="button" className="calendar-nav" onClick={prevMonth} style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                          </button>
                          <div className="calendar-title" style={{
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}>
                            {getMonthAndYear(currentDate)}
                          </div>
                          <button type="button" className="calendar-nav" onClick={nextMonth} style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </button>
                        </div>

                        <div className="calendar-weekdays" style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '0px'
                        }}>
                          <div>S</div>
                          <div>M</div>
                          <div>T</div>
                          <div>W</div>
                          <div>T</div>
                          <div>F</div>
                          <div>S</div>
                        </div>

                        <div className="calendar-days" style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          gap: '0px',
                          textAlign: 'center'
                        }}>
                          {generateCalendarDays({
                            clickable: true,
                            highlightSelected: true,
                            leavesForIndicator: approvedLeaves,
                            isModal: true
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <div className="document-upload" style={{ position: 'relative' }}>
                      <input
                        type="file"
                        id="document"
                        name="document"
                        className="document-input"
                        onChange={handleDocumentUpload}
                        style={{ display: 'none' }}
                      />
                      <div className="document-input-wrapper" style={{ position: 'relative' }}>
                        <input
                          type="text"
                          readOnly
                          placeholder="Documents"
                          style={{
                            width: '100%',
                            padding: '14px 20px',
                            paddingRight: '40px',
                            border: '1px solid #4d007d',
                            borderRadius: '12px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            boxSizing: 'border-box'
                          }}
                          onClick={() => document.getElementById('document').click()}
                          value={formData.document ? formData.document.name : ''}
                        />
                        <button
                          type="button"
                          style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onClick={() => document.getElementById('document').click()}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                        </button>
                        <span style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '15px',
                          fontSize: '12px',
                          backgroundColor: 'white',
                          padding: '0 5px',
                          color: '#4d007d'
                        }}>Documents</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Reason"
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      border: '1px solid #4d007d',
                      borderRadius: '12px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '15px',
                    fontSize: '12px',
                    backgroundColor: 'white',
                    padding: '0 5px',
                    color: '#4d007d'
                  }}>Reason*</span>
                </div>

                <div className="modal-footer" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '20px'
                }}>
                  <button type="submit" className="btn-primary submit-btn" style={{
                    padding: '12px 30px',
                    backgroundColor: '#4d007d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    width: '150px'
                  }}>
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

export default Leaves; 