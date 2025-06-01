import React from 'react';
import './User.css';

const UserProfile = () => {
  return (
    <div className="user-profile-container">
      <h2>Jabir Jamal</h2>
      <p className="section-subtitle">Basic Information</p>
      <p className="section-description">
        Make sure this information is up to date and matches any government-issued ID.
      </p>
      <button className="edit-btn">Edit</button>

      <div className="profile-section">
        <div className="profile-row">
          <span className="label">Name</span>
          <span className="value">Jabir Jamal</span>
        </div>
        <div className="profile-row">
          <span className="label">Bio</span>
          <span className="value">Not provided</span>
        </div>
        <div className="profile-row">
          <span className="label">Date of Birth</span>
          <span className="value">Not provided</span>
        </div>
        <div className="profile-row">
          <span className="label">Gender</span>
          <span className="value">Not provided</span>
        </div>
        <div className="profile-row">
          <span className="label">Accessibility Needs</span>
          <span className="value">Not provided</span>
        </div>
      </div>

      <hr />

      <p className="section-subtitle">Contact</p>
      <p className="section-description">
        Receive service updates and important alerts by keeping your contact info current.
      </p>
      <button className="edit-btn">Edit</button>

      <div className="profile-section">
        <div className="profile-row">
          <span className="label">Mobile Number</span>
          <span className="value">Not provided</span>
        </div>
        <div className="profile-row">
          <span className="label">Email</span>
          <span className="value">jamaljabir4@gmail.com</span>
        </div>
        <div className="profile-row">
          <span className="label">Emergency Contact</span>
          <span className="value">Not provided</span>
        </div>
        <div className="profile-row">
          <span className="label">Address</span>
          <span className="value">Not provided</span>
        </div>
      </div>

      <hr />

      <p className="section-subtitle">Service Preferences</p>
      <p className="section-description">
        Speed up booking and get matched better by saving your preferences.
      </p>
      <button className="edit-btn">Edit</button>

      <div className="profile-section">
        <div className="profile-row">
          <span className="label">Preferred Contractor Type</span>
          <span className="value">Not provided</span>
        </div>
        <div className="profile-row">
          <span className="label">Service Types</span>
          <span className="value">Not provided</span>
        </div>
        <div className="profile-row">
          <span className="label">Notification Preferences</span>
          <span className="value">Not provided</span>
        </div>
        <div className="profile-row">
          <span className="label">Reward Program</span>
          <span className="value">Not provided</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
