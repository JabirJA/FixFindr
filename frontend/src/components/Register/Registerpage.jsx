import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Registerpage.css';
import logo2 from '../../assets/logo.png';
import SERVICES from '../../pages/services';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [role, setRole] = useState('user');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nin, setNIN] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsText, setTermsText] = useState('');
  const [serviceType, setServiceType] = useState('');
  const navigate = useNavigate();

  const fetchTerms = async () => {
    const fileName = role === 'contractor' ? 'contractor-terms.txt' : 'user-terms.txt';
    try {
      const response = await fetch(`/terms/${fileName}`);
      const text = await response.text();
      setTermsText(text);
    } catch (error) {
      console.error('Failed to load terms:', error);
      setTermsText('Unable to load terms and conditions.');
    }
  };

  useEffect(() => {
    if (showTermsModal) {
      fetchTerms();
    }
  }, [showTermsModal, role]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const payload = role === 'contractor' 
    ? {
        firstName,
        lastName,
        email,
        password,
        role,
        serviceType,
        phone,
        nin,
        age: Number(age),
        city,
        state,
        // ...other contractor-specific fields or nulls
      }
    : {
        firstName,
        lastName,
        email,
        password,
        role,
      };
  
    console.log('Register payload:', payload);
    try {
      const response = await axios.post('http://localhost:5050/auth/register', payload);
      console.log('User registered:', response.data);

      if (role === 'user') {
        navigate('/dashboard');
      } else if (role === 'contractor') {
        navigate('/contractor/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="imgdiv">
        <img className="img" src={logo2} alt="logo" />
      </div>

      <h1 className="register-title">Create Account</h1>

      <div className="role-selector">
        <button
          type="button"
          onClick={() => setRole('user')}
          className={role === 'user' ? 'role-button active' : 'role-button'}
        >
          I'm a User
        </button>
        <button
          type="button"
          onClick={() => setRole('contractor')}
          className={role === 'contractor' ? 'role-button active' : 'role-button'}
        >
          I'm a Contractor
        </button>
      </div>

      {role === 'contractor' && (
        <div className="form-group">
          <label>Type of Service</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
          >
            <option value="">Select Service Type</option>
            {SERVICES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label>Full Name</label>
          <div className="name-inputs">
            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {role === 'contractor' && (
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {role === 'contractor' && (
          <div className="contractor-fields">
            <div className="form-column">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>NIN</label>
                <input
                  type="text"
                  value={nin}
                  onChange={(e) => setNIN(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
            />{' '}
            Agree with{' '}
            <span
              className="terms-text"
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              onClick={() => setShowTermsModal(true)}
            >
              Terms and Conditions
            </span>
          </label>
        </div>

        <div className="submit-button-container">
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </div>
      </form>

      <div className="login-redirect">
        Already have an account? <Link to="/login">Log in</Link>
      </div>

      {showTermsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Terms and Conditions</h2>
            <pre className="terms-text-box">{termsText}</pre>
            <button onClick={() => setShowTermsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
