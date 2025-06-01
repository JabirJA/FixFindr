import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import logo from '../../../assets/placeholder.png';

const Sidebar = ({ activeTab, setActiveTab, profileImage }) => {
  const defaultImage = logo;
  const userImage = profileImage || defaultImage;

  const [isVisible, setIsVisible] = useState(false);

  // Show sidebar by default on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Toggle button always shown on small screens */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰ 
      </button>

      {/* Sidebar with conditional visibility on small screens */}
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
          <button className="signout-button">Sign Out</button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
