import React from "react";
import "./User.css";

export default function Security() {
  return (
    <div className="security-container">
      <h1 className="security-heading">Security & Settings</h1>

      <section className="security-section">
        <h2 className="section-title">Sign-In & Security</h2>
        <p className="section-description">
          Manage how you sign in to your FixFinder account. Keep things secure with a strong password and stay in control of your logged-in devices.
        </p>

        <div className="security-row">
          <p className="row-label">Email</p>
          <div className="row-content">
            <span className="row-value">jamaljabir4@gmail.com</span>
            <button className="link-button">Update</button>
          </div>
        </div>

        <div className="security-row">
          <p className="row-label">Password</p>
          <div className="row-content">
            <span className="row-value">••••••••</span>
            <button className="link-button">Change Password</button>
          </div>
        </div>

        <div className="security-row">
          <p className="row-label">Connected Devices</p>
          <div className="row-content">
            <span className="row-value">2 active sessions</span>
            <button className="link-button">Sign Out Everywhere</button>
          </div>
        </div>
      </section>

      <section className="security-section">
        <h2 className="section-title">Account Preferences</h2>

        <div className="security-row">
          <p className="row-label">Notification Settings</p>
          <div className="row-content">
            <span className="row-value">Receive job alerts and updates</span>
            <button className="link-button">Manage</button>
          </div>
        </div>

        <div className="security-row delete-row">
          <p className="row-label">Delete Account</p>
          <div className="row-content">
            <span className="row-value red-text">
              Permanently delete your FixFinder account and all associated data.
            </span>
            <button className="link-button red-text">Delete Account</button>
          </div>
        </div>
      </section>
    </div>
  );
}
