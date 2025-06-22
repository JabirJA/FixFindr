import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import AccountInfo from './AccountInfo';
import JobHistory from './JobHistory';
import Messages from './Messages';
import AppPreferences from '../AppPreferences';
import CAnalytics from './CAnalytics';
import Availability from './AvailabilityPage';
import './Dashboard.css';

const ContractorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileToken = localStorage.getItem('profileToken');

  useEffect(() => {
    if (!profileToken) {
      setLoading(false);
      return;
    }

    const fetchContractor = async () => {
      try {
        const res = await fetch(`http://localhost:5050/contractors/dashboard/${profileToken}`);
        if (!res.ok) throw new Error('Failed to fetch contractor');
        const data = await res.json();
        console.log('Fetched contractor:', data);
        setContractor(data.contractor || data); 
      } catch (error) {
        console.error('Error fetching contractor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractor();
  }, [profileToken]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'account':
        return <AccountInfo contractor={contractor} />;
      case 'history':
        return <JobHistory />;
      case 'messages':
        return <Messages />;
      case 'settings':
        return <AppPreferences />;
      case 'analytics':
        return <CAnalytics />;
      case 'availability':
        return <Availability contractor={contractor}/>;
      default:
        return <DashboardHome />;
    }
  };

  if (!profileToken) {
    return (
      <div className="dashboard-container">
        <p className="unauthorized-message">Unauthorized: Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        contractor={contractor}
      />
      <div className="dashboard-main">
        {loading ? (
          <div className="loading-indicator">
            <p>Loading contractor data...</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;
