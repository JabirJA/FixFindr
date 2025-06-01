import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import logo2 from '../../assets/logo.png';

const LoginPage = () => {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password, role });
      console.log(response.data);
      // window.location.href = role === 'contractor' ? '/contractor-dashboard' : '/user-dashboard';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="imgdiv">
          <img className="img" src={logo2} alt="logo" />
        </div>

        <h1 className="login-title">Login</h1>

        <div className="role-selector">
          <button
            type="button"
            className={role === 'user' ? 'role-button active' : 'role-button'}
            onClick={() => setRole('user')}
          >
            User
          </button>
          <button
            type="button"
            className={role === 'contractor' ? 'role-button active' : 'role-button'}
            onClick={() => setRole('contractor')}
          >
            Contractor
          </button>
        </div>

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
            />
            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login as {role === 'contractor' ? 'Contractor' : 'User'}
          </button>
        </form>

        <div className="register-redirect">
          New user? <a href="/register">Register here</a>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
