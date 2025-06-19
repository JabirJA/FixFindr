import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import logo from '../../../assets/placeholderImg.png';
import { useNavigate } from 'react-router-dom';
import { handleSignOut } from '../../../utils/functions';
import { getProfilePhotoUrl} from '../../../utils/images';
const Sidebar = ({ activeTab, setActiveTab, contractor }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(window.innerWidth > 768);

  // Use contractor's profile photo if available, else profileImage prop, else default logo
  const userImage = getProfilePhotoUrl(contractor) || logo;

  const navItems = [
    { key: 'dashboard', label: 'Dashboard Home' },
    { key: 'availability', label: 'Availability' },
    { key: 'messages', label: 'Messages' },
    { key: 'history', label: 'Job History' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'account', label: 'Account Info' },
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
          <p>Welcome, {contractor?.first_name || 'Contractor'}</p>
        </div>

        <ul className="tab-list">
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
          <button className="signout-button" onClick={() => handleSignOut(navigate)}>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
