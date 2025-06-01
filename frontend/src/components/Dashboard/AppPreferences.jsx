import React, { useState, useEffect } from 'react';
import './AppPreferences.css';

const AppPreferences = () => {
  const [language, setLanguage] = useState('english');
  const [theme, setTheme] = useState('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unit, setUnit] = useState('metric');
  const [timezone, setTimezone] = useState('Africa/Lagos');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

  return (
    <div className="app-preferences-container">
      <h2>App Preferences</h2>
      <p>Customize your FixFinder experience.</p>

      <div className="preference-section">
        <h3>Language</h3>
        <select
          className="pref-select"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="english">English</option>
          <option value="pidgin">Pidgin</option>
          <option value="hausa">Hausa</option>
          <option value="yoruba">Yoruba</option>
          <option value="french">French</option>
        </select>
      </div>

      <div className="preference-section">
        <h3>Theme</h3>
        <label className="toggle-container">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <span className="slider"></span>
          <span className="toggle-label">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </label>
      </div>

      <div className="preference-section">
        <h3>Notifications</h3>
        <label className="toggle-container">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={toggleNotifications}
          />
          <span className="slider"></span>
          <span className="toggle-label">
            {notificationsEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      <div className="preference-section">
        <h3>Units</h3>
        <select
          className="pref-select"
          value={unit}
          onChange={e => setUnit(e.target.value)}
        >
          <option value="metric">Metric (km, m)</option>
          <option value="imperial">Imperial (mi, ft)</option>
        </select>
      </div>

      <div className="preference-section">
        <h3>Time Zone</h3>
        <select
          className="pref-select"
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
        >
          <option value="Africa/Lagos">Africa/Lagos</option>
          <option value="America/New_York">America/New York</option>
          <option value="Europe/London">Europe/London</option>
          <option value="Asia/Dubai">Asia/Dubai</option>
        </select>
      </div>
    </div>
  );
};

export default AppPreferences;
