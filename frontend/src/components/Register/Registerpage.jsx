import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Registerpage.css';
import logo2 from '../../assets/logo.png';
import SERVICES from '../../pages/services';

const RegisterPage = () => {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Contractor-specific fields
  const [phone, setPhone] = useState('');
  const [nin, setNIN] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsText, setTermsText] = useState('');

  // New state for service type
  const [serviceType, setServiceType] = useState('');

 
  // Fetch terms and conditions based on user or contractor role
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

    const payload = {
      name,
      email,
      password,
      role,
      serviceType, // Include the selected service type in the payload
    };

    if (role === 'contractor') {
      payload.contact = { phone };
      payload.nin = nin;
      payload.age = age;
      payload.city = city;
      payload.state = state;
    }

    try {
      const response = await axios.post('/api/register', payload);
      console.log('User registered:', response.data);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <>
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

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="name-inputs">
              <input
                type="text"
                placeholder="First Name"
                name="first_name"
                required
                value={name.split(' ')[0]}
                onChange={(e) => setName(e.target.value + ' ' + name.split(' ')[1])}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="last_name"
                required
                value={name.split(' ')[1]}
                onChange={(e) => setName(name.split(' ')[0] + ' ' + e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {role === 'contractor' && (
            <div className="contractor-fields">
              <div className="form-column">
                {/* Add dropdown for service type */}
                <div className="form-group">
                <label>Type of Service</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
                  <option value="">Select Service Type</option>
                  {SERVICES.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
                </div>
              </div>

              <div className="form-column">
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>NIN</label>
                  <input type="text" value={nin} onChange={(e) => setNIN(e.target.value)} />
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
              Agree with <span className="terms-text" onClick={() => setShowTermsModal(true)}>Terms and Conditions</span>
            </label>
          </div>

          <div className="submit-button-container">
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </div>
        </form>
        <div className="login-redirect">
        Already have an account? <a href="/login">Log in</a>
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
    </>
  );
};

export default RegisterPage;
