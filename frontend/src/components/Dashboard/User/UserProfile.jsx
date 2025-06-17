import React from 'react';
import './User.css';

const UserProfile = ({ user }) => {
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="user-profile-container">
      <h2>{user.first_name} {user.last_name}</h2>
      <p className="section-subtitle">Account Overview</p>
      <p className="section-description">
        Ensure your information is accurate to enjoy the best of FixFinder services.
      </p>
      <button className="edit-btn">Edit Profile</button>

      <div className="profile-section">
        <div className="profile-row">
          <span className="label">Name</span>
          <span className="value">{user.first_name} {user.last_name}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email</span>
          <span className="value">{user.email}</span>
        </div>
        <div className="profile-row">
          <span className="label">Address</span>
          <span className="value">{user.address || 'Not provided'}</span>
        </div>
        <div className="profile-row">
          <span className="label">Date of Birth</span>
          <span className="value">{user.date_of_birth || 'Not provided'}</span>
        </div>
        <div className="profile-row">
          <span className="label">Gender</span>
          <span className="value">{user.gender || 'Not provided'}</span>
        </div>
        <div className="profile-row">
          <span className="label">Member Since</span>
          <span className="value">June 2025</span> {/* You can replace with actual data */}
        </div>
      </div>

      <hr />

      <p className="section-subtitle">Service Preferences</p>
      <p className="section-description">
        Save your preferences for faster matching and improved booking experience.
      </p>
      <button className="edit-btn">Edit Preferences</button>

      <div className="profile-section">
        <div className="profile-row">
          <span className="label">Notification Preferences</span>
          <span className="value">Email & SMS</span>
        </div>
        <div className="profile-row">
          <span className="label">Reward Program</span>
          <span className="value">Silver Tier</span>
        </div>
      </div>

      <hr />
    </div>
  );
};

export default UserProfile;
