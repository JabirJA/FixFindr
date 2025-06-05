import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import logo from '../../../assets/placeholder.png';
import { useNavigate } from 'react-router-dom';
import { handleSignOut } from '../../../utils/functions';

const Sidebar = ({ activeTab, setActiveTab, profileImage }) => {
  const defaultImage = logo;
  const userImage = profileImage || defaultImage;
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

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
          <img src={userImage} alt="Profile" className="profile-pic" />
          <p>Welcome, Jabir</p>
        </div>

        <ul className="tab-list">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Dashboard Home
          </li>
          <li className={activeTab === 'availability' ? 'active' : ''} onClick={() => setActiveTab('availability')}>
            Availability
          </li>
          <li className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            Messages
          </li>
          <li className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
            Job History
          </li>
          <li className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
            Analytics
          </li>
          <li className={activeTab === 'account' ? 'active' : ''} onClick={() => setActiveTab('account')}>
            Account Info
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

export default Sidebar;
