import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import AccountInfo from './AccountInfo';
import JobHistory from './JobHistory';
import Messages from './Messages';
import AppPreferences from '../AppPreferences';
import CAnalytics from './CAnalytics';
import Availability from './AvailabilityPage';
import './Dashboard.css';
import logo from '../../../assets/man.png'; // Placeholder or default image

const ContractorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const profileImage = logo; 
  const profileToken = localStorage.getItem('profileToken');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'account':
        return <AccountInfo />;
      case 'history':
        return <JobHistory />;
      case 'messages':
        return <Messages />;
      case 'settings':
        return <AppPreferences />;
      case 'analytics':
        return <CAnalytics />;
      case 'availability':
        return <Availability />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
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

export default ContractorDashboard;
