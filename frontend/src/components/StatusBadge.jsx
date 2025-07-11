import React, { useState, useRef, useEffect } from 'react';

const StatusBadge = ({ status, onStatusChange, id, type = 'candidate' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  const getStatusOptions = () => {
    if (type === 'candidate') {
      return ['Scheduled', 'Ongoing', 'Selected', 'Rejected'];
    } else if (type === 'attendance') {
      return ['Present', 'Absent'];
    } else if (type === 'leave') {
      return ['Pending', 'Approved', 'Rejected'];
    }
    return [];
  };


  const getStatusColor = () => {
    if (type === 'candidate') {
      switch (status) {
        case 'Scheduled':
          return '#e8b000';
        case 'Ongoing':
          return '#008313';
        case 'Selected':
          return '#4d007d';
        case 'Rejected':
          return '#b70000';
        default:
          return '#a4a4a4';
      }
    } else if (type === 'attendance') {
      switch (status) {
        case 'Present':
          return '#008313';
        case 'Absent':
          return '#b70000';
        default:
          return '#6B7280';
      }
    } else if (type === 'leave') {
      switch (status) {
        case 'Approved':
          return '#10B981';
        case 'Rejected':
          return '#EF4444';
        case 'Pending':
          return '#FFB800';
        default:
          return '#6B7280';
      }
    }
    return '#6B7280';
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

    
  const handleStatusChange = (newStatus) => {
    if (onStatusChange && id) {
      onStatusChange(id, newStatus);
    }
    setIsOpen(false);
  };

  return (
    <div className="status-badge-container" ref={dropdownRef}>
      <button
        className="status-badge"
        onClick={toggleDropdown}
        style={{
          backgroundColor: `${getStatusColor()}20`,
          color: getStatusColor(),
          border: `1px solid ${getStatusColor()}`,
        }}
      >
        {status}
        {onStatusChange && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dropdown-icon"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        )}
      </button>

      {isOpen && onStatusChange && (
        <div className="status-dropdown">
          {getStatusOptions().map((option) => (
            <div
              key={option}
              className={`status-option ${status === option ? 'active' : ''}`}
              onClick={() => handleStatusChange(option)}
              style={{
                backgroundColor: status === option ? `${getStatusColor()}20` : '',
                color: status === option ? getStatusColor() : '',
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBadge; 