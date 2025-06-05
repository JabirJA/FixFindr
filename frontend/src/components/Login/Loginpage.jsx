import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import logo2 from '../../assets/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedirect = (role, profileToken) => {
    const roleRoutes = {
      contractor: `/contractor/${profileToken}`,
      admin: `/admin/${profileToken}`,
      user: `/dashboard/${profileToken}`,
    };
    window.location.href = roleRoutes[role] || '/login';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5050/auth/login', {
        email,
        password,
      });

      const { userId, role, profileToken } = response.data;

      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('profileToken', profileToken);
      localStorage.setItem('userRole', role);

      handleRedirect(role, profileToken);
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      console.error('Login failed:', message);
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="imgdiv">
        <img className="img" src={logo2} alt="Fix Finder logo" />
      </div>

      <h1 className="login-title">Login to Fix Finder</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="login-label">Email</label>
          <input
            type="email"
            id="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="login-label">Password</label>
          <input
            type="password"
            id="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="register-redirect">
        New user? <a href="/register">Register here</a>
      </div>
    </div>
  );
};

export default LoginPage;
