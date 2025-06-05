import React, { useState, useEffect } from 'react';
import './User.css';
import logo from '../../../assets/placeholder.png';
import { handleSignOut } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';

const UserSidebar = ({ activeTab, setActiveTab, profileImage, profileToken }) => {
  const navigate = useNavigate();
  const defaultImage = logo;
  const userImage = profileImage || defaultImage;
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(window.innerWidth > 768);

  useEffect(() => {
    if (!profileToken) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5050/user/dashboard/${profileToken}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [profileToken]);

  const navItems = [
    { key: 'profile', label: 'User Profile' },
    { key: 'bookings', label: 'Booking Confirmations' },
    { key: 'security', label: 'Security & Settings' },
    { key: 'help', label: 'Help & Feedback' },
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

      <div className={`user-sidebar ${isVisible ? 'visible' : ''}`}>
        <div className="user-profile-header">
          <img src={userImage} alt="User" className="user-profile-pic" />
          <p className="user-welcome">Hi, {user?.first_name || 'Guest'}</p>
        </div>

        <ul className="user-tab-list">
          {navItems.map((item) => (
            <li
              key={item.key}
              className={activeTab === item.key ? 'active' : ''}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
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

export default UserSidebar;
