import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserProfile from './UserProfile';
import BookingConfirmations from './BookingConfirmation';
import SecuritySettings from './Security';
import HelpFeedback from './HelpFeedback';
import AppPreferences from '../AppPreferences';
import './User.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const profileImage = null; // Replace with user?.profileImage when integrating auth
  const profileToken = localStorage.getItem('profileToken'); //
  
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'bookings':
        return <BookingConfirmations />;
      case 'security':
        return <SecuritySettings />;
      case 'help':
        return <HelpFeedback />;
      case 'settings':
        return <AppPreferences />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="dashboard-container">
     <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profileImage={profileImage}
        profileToken={profileToken}  
      />
      <div className="dashboard-main">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserDashboard;
