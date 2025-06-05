import React, { useState, useEffect } from 'react';
import './User.css';
import logo from '../../../assets/placeholder.png';
import { handleSignOut } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';

const UserSidebar = ({ activeTab, setActiveTab, profileImage }) => {
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

      <div className={`user-sidebar ${isVisible ? 'visible' : ''}`}>
        <div className="user-profile-header">
          <img src={userImage} alt="User" className="user-profile-pic" />
          <p className="user-welcome">Hi, Jabir</p>
        </div>

        <ul className="user-tab-list">
          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            User Profile
          </li>
          <li className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
            Booking Confirmations
          </li>
          <li className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
            Security & Settings
          </li>
          <li className={activeTab === 'help' ? 'active' : ''} onClick={() => setActiveTab('help')}>
            Help & Feedback
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

export default UserSidebar;
