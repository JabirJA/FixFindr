import React, { useState, useEffect } from 'react';
import './User.css';
import logo from '../../../assets/placeholder.png';
import { handleSignOut } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';

const UserSidebar = ({ activeTab, setActiveTab, user }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(window.innerWidth > 768);

  const userImage = user?.profile_photo || logo;

  const navItems = [
    { key: 'profile', label: 'User Profile' },
    { key: 'bookings', label: 'Booking Confirmations' },
    { key: 'security', label: 'Security & Settings' },
    { key: 'help', label: 'Help & Feedback' },
    { key: 'settings', label: 'App Preferences' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`user-sidebar ${isVisible ? 'visible' : ''}`}>
        <div className="user-profile-header">
          <img src={userImage} alt="User" className="user-profile-pic" />
          <p className="user-welcome">Hi, {user?.first_name || 'Guest'}</p>
        </div>

        <ul className="user-tab-list">
          {navItems.map(({ key, label }) => (
            <li
              key={key}
              className={activeTab === key ? 'active' : ''}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <button
            className="signout-button"
            onClick={() => handleSignOut(navigate)}
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
