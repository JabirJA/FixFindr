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
  const [loading, setLoading] = useState(true);
  const profileToken = localStorage.getItem('profileToken');

  useEffect(() => {
    if (!profileToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/user/dashboard/${profileToken}`); // Fixed missing colon
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [profileToken]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile user={user} />;
      case 'bookings':
        return <BookingConfirmations user={user}/>;
      case 'security':
        return <SecuritySettings user={user} />;
      case 'help':
        return <HelpFeedback />;
      case 'settings':
        return <AppPreferences />;
      default:
        return <UserProfile user={user} />;
    }
  };

  if (!profileToken) {
    return (
      <div className="dashboard-container">
        <p className="unauthorized-message">
          Unauthorized: Please log in to access your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />
      <div className="dashboard-main">
        {loading ? (
          <div className="loading-indicator">
            <p>Loading user data...</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
