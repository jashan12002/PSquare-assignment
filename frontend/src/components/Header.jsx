import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';

const Header = ({ title }) => {
  const { user } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditProfile = () => {
    setShowDropdown(false);
    console.log('Edit Profile clicked');
  };

  const handleChangePassword = () => {
    setShowDropdown(false);
    console.log('Change Password clicked');
  };

  const handleManageNotification = () => {
    setShowDropdown(false);
    console.log('Manage Notification clicked');
  };

  const handleLogout = () => {
    setShowDropdown(false);
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="header">
      <h1 className="header-title">{title}</h1>

      <div className="header-actions">
        <p>
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4L8.8906 9.2604C9.5624 9.70827 10.4376 9.70827 11.1094 9.2604L19 4M3 15H17C18.1046 15 19 14.1046 19 13V3C19 1.89543 18.1046 1 17 1H3C1.89543 1 1 1.89543 1 3V13C1 14.1046 1.89543 15 3 15Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
        <p>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.00006 3.5C11.7615 3.5 14.0001 5.73858 14.0001 8.5V10.7396C14.0001 11.2294 14.1798 11.7022 14.5052 12.0683L15.7809 13.5035C16.6408 14.4708 15.9541 16 14.6598 16H3.34031C2.04604 16 1.35933 14.4708 2.2192 13.5035L3.49486 12.0683C3.82028 11.7022 4.00004 11.2294 4.00004 10.7396L4.00006 8.5C4.00006 5.73858 6.23864 3.5 9.00006 3.5ZM9.00006 3.5V1M8 19H10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>

        <div className="header-user" ref={dropdownRef} onClick={toggleDropdown}>
          <div className="header-user-avatar">
            {getInitials(user?.name)}
          </div>
          <svg 
            width="12" 
            height="8" 
            viewBox="0 0 12 8" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
          >
            <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={handleEditProfile}>Edit Profile</div>
              <div className="dropdown-item" onClick={handleChangePassword}>Change Password</div>
              <div className="dropdown-item" onClick={handleManageNotification}>Manage Notification</div>
              <div className="dropdown-item" onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={closeLogoutModal} />
    </div>
  );
};

export default Header;
