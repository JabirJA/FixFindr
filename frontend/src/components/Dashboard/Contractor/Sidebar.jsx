import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import logo from '../../../assets/placeholder.png';
import { useNavigate } from 'react-router-dom';
import { handleSignOut } from '../../../utils/functions';

const Sidebar = ({ activeTab, setActiveTab, profileImage, profileToken }) => {
  const navigate = useNavigate();
  const defaultImage = logo;
  const userImage = profileImage || defaultImage;

  const [isVisible, setIsVisible] = useState(false);
  const [contractor, setContractor] = useState(null);

  useEffect(() => {
    if (!profileToken) return;

    const fetchContractor = async () => {
      try {
        const res = await fetch(`http://localhost:5050/contractors/dashboard/${profileToken}`);
        if (!res.ok) throw new Error('Failed to fetch contractor');
        const data = await res.json();
        setContractor(data);
      } catch (error) {
        console.error('Error fetching contractor:', error);
      }
    };

    fetchContractor();
  }, [profileToken]);

  const navItems = [
    { key: 'dashboard', label: 'Dashboard Home' },
    { key: 'availability', label: 'Availability' },
    { key: 'messages', label: 'Messages' },
    { key: 'history', label: 'Job History' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'account', label: 'Account Info' },
    { key: 'settings', label: 'App Preferences' },
  ];

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
