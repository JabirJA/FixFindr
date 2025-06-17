import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSidebar from './UserSidebar';
import UserProfile from './UserProfile';
import BookingConfirmations from './BookingConfirmation';
import SecuritySettings from './Security';
import HelpFeedback from './HelpFeedback';
import AppPreferences from '../AppPreferences';
import './User.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);

  const profileToken = localStorage.getItem('profileToken');

  useEffect(() => {
    if (profileToken) {
      axios.get(`/user/dashboard/${profileToken}`)
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error('Error fetching user:', err);
        });
    }
  }, [profileToken]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile user={user} />;
      case 'bookings':
        return <BookingConfirmations />;
      case 'security':
        return <SecuritySettings user={user}/>;
      case 'help':
        return <HelpFeedback />;
      case 'settings':
        return <AppPreferences />;
      default:
        return <UserProfile user={user} />;
    }
  };

  return (
    <div className="dashboard-container">
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profileImage={null}
        profileToken={profileToken}
      />
      <div className="dashboard-main">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserDashboard;
