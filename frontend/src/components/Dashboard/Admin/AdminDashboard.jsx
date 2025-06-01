import React, { useState } from 'react';
import Sidebar from './AdminSidebar'; // Admin sidebar with logout button & toggle
import Analytics from './Analytics';
import ContractorManagement from './ContractorManagement';
import BookingManagement from './BookingManagement';
import Messages from './AdminMessages';
import AppPreferences from '../AppPreferences';
import './Dashboard.css';
import logo from '../../../assets/admin.png'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true); // for toggle on small screens

  const profileImage = logo || null; // Replace with admin?.profileImage if available

  const handleLogout = () => {
    // Implement your logout logic here, e.g., clear auth tokens, redirect, etc.
    console.log('Logout clicked');
    // Example redirect after logout:
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <Analytics />;
      case 'contractors':
        return <ContractorManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'messages':
        return <Messages />;
        case 'settings':
            return <AppPreferences />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Toggle button visible on small screens */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profileImage={profileImage}
        isAdmin={true}
        isOpen={sidebarOpen}
        onLogout={handleLogout}
      />

      <div className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
