import React, { useState, useRef, useEffect } from 'react';

const StatusBadge = ({ status, onStatusChange, id, type = 'candidate' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Define status options based on type
  const getStatusOptions = () => {
    if (type === 'candidate') {
      return ['Shortlisted', 'Ongoing', 'Selected', 'Rejected'];
    } else if (type === 'attendance') {
      return ['Present', 'Absent', 'Leave'];
    } else if (type === 'leave') {
      return ['Pending', 'Approved', 'Rejected'];
    }
    return [];
  };

  // Get status color
  const getStatusColor = () => {
    if (type === 'candidate') {
      switch (status) {
        case 'Shortlisted':
          return '#FFB800';
        case 'Interview':
          return '#3B82F6';
        case 'Selected':
          return '#10B981';
        case 'Rejected':
          return '#EF4444';
        default:
          return '#6B7280';
      }
    } else if (type === 'attendance') {
      switch (status) {
        case 'Present':
          return '#10B981';
        case 'Absent':
          return '#EF4444';
        case 'Leave':
          return '#3B82F6';
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

  // Close dropdown when clicking outside
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

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle status change
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