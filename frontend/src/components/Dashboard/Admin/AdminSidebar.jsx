import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import logo from '../../../assets/placeholder.png';
import { handleSignOut } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab, profileImage }) => {
  const defaultImage = logo;
  const userImage = profileImage || defaultImage;
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰ 
      </button>

      <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
        <div className="profile-header">
          <img src={userImage} alt="Admin Profile" className="profile-pic" />
          <p>Welcome, Admin</p>
        </div>

        <ul className="tab-list">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Dashboard Home
          </li>
          <li className={activeTab === 'contractors' ? 'active' : ''} onClick={() => setActiveTab('contractors')}>
            Contractor Management
          </li>
          <li className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
            Booking Management
          </li>
          <li className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
            Analytics
          </li>
          <li className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            Messages
          </li>
          <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            App Preferences
          </li>
        </ul>

        <div className="sidebar-footer">
          <button className="signout-button" onClick={() => handleSignOut(navigate)}>
                      Sign Out
                    </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
