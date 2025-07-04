import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoutModal from './LogoutModal';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{
      width: '32px',
      height: '32px',
      backgroundColor: '#5E1DAD',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '16px',
        height: '16px',
        border: '2px solid white',
        borderRadius: '4px'
      }}></div>
    </div>
    <span style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>LOGO</span>
  </div>
);

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <Logo />
      </div>

      {/* Search Section */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ position: 'relative' }}>
          <svg
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: '#666'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '16px',
              paddingTop: '10px',
              paddingBottom: '10px',
              fontSize: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '20px',
              outline: 'none',
              backgroundColor: '#f5f5f5'
            }}
          />
        </div>
      </div>

      {/* Recruitment Section */}
      <div className="sidebar-menu-title">Recruitment</div>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/candidates"
            className={({ isActive }) =>
              isActive ? "sidebar-menu-item active" : "sidebar-menu-item"
            }
          >
            <svg width="20" height="20" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 33H24M16.5 40.5V25.5M43.5 42C54.8899 42 60.6914 46.0121 62.4279 54.0364C63.1287 57.2751 60.3137 60 57 60H30C26.6863 60 23.8713 57.2752 24.5721 54.0364C26.3086 46.0121 32.1101 42 43.5 42ZM43.5 30C48.5 30 51 27.4286 51 21C51 14.5714 48.5 12 43.5 12C38.5 12 36 14.5714 36 21C36 27.4286 38.5 30 43.5 30Z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Candidates
          </NavLink>
        </li>
      </ul>

      {/* Organization Section */}
      <div className="sidebar-menu-title">Organization</div>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              isActive ? "sidebar-menu-item active" : "sidebar-menu-item"
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.5051 19H20C21.1046 19 22.0669 18.076 21.716 17.0286C21.1812 15.4325 19.8656 14.4672 17.5527 14.1329M14.5001 10.8645C14.7911 10.9565 15.1244 11 15.5 11C17.1667 11 18 10.1429 18 8C18 5.85714 17.1667 5 15.5 5C15.1244 5 14.7911 5.04354 14.5001 5.13552M9.5 14C13.1135 14 15.0395 15.0095 15.716 17.0286C16.0669 18.076 15.1046 19 14 19H5C3.89543 19 2.93311 18.076 3.28401 17.0286C3.96047 15.0095 5.88655 14 9.5 14ZM9.5 11C11.1667 11 12 10.1429 12 8C12 5.85714 11.1667 5 9.5 5C7.83333 5 7 5.85714 7 8C7 10.1429 7.83333 11 9.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Employees
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              isActive ? "sidebar-menu-item active" : "sidebar-menu-item"
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 11C10 10.4477 10.4477 10 11 10H13C13.5523 10 14 10.4477 14 11V19C14 19.5523 13.5523 20 13 20H11C10.4477 20 10 19.5523 10 19V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 15C4 14.4477 4.44772 14 5 14H7C7.55228 14 8 14.4477 8 15V19C8 19.5523 7.55228 20 7 20H5C4.44772 20 4 19.5523 4 19V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 7C16 6.44772 16.4477 6 17 6H19C19.5523 6 20 6.44772 20 7V19C20 19.5523 19.5523 20 19 20H17C16.4477 20 16 19.5523 16 19V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Attendance
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/leaves"
            className={({ isActive }) =>
              isActive ? "sidebar-menu-item active" : "sidebar-menu-item"
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4C10 7.31371 7.31371 10 4 10C7.31371 10 10 12.6863 10 16C10 12.6863 12.6863 10 16 10C12.6863 10 10 7.31371 10 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.5 15C17.5 16.3807 16.3807 17.5 15 17.5C16.3807 17.5 17.5 18.6193 17.5 20C17.5 18.6193 18.6193 17.5 20 17.5C18.6193 17.5 17.5 16.3807 17.5 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Leaves
          </NavLink>
        </li>
      </ul>

      {/* Others Section */}
      <div className="sidebar-menu-title">Others</div>
      <ul className="sidebar-menu">
        <li>
          <a href="#" onClick={handleLogoutClick} className="sidebar-menu-item">
            <svg width="20" height="20" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 17H3C1.89543 17 1 16.1046 1 15L1 3C1 1.89543 1.89543 1 3 1H11M7 9H18M18 9L15 12M18 9L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            Logout
          </a>
        </li>
      </ul>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={closeLogoutModal} />
    </div>
  );
};

export default Sidebar;