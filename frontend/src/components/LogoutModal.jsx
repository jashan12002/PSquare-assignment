import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LogoutModal = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthContext);
  
  if (!isOpen) return null;
  
  const handleLogout = () => {
    logout();
    onClose();
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Log Out</h2>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to log out?</p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal; 