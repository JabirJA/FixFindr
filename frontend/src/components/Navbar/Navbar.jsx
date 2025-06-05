import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [profileToken, setProfileToken] = useState('');

  useEffect(() => {
    const updateAuthState = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const role = localStorage.getItem('userRole') || '';
      const token = localStorage.getItem('profileToken') || '';
      setIsLoggedIn(loggedIn);
      setUserRole(role);
      setProfileToken(token);
    };

    updateAuthState();

    // Listen for auth changes (sign in/out) on this tab or other tabs
    window.addEventListener('authChange', updateAuthState);
    return () => window.removeEventListener('authChange', updateAuthState);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const getDashboardLink = () => {
    if (!profileToken) return '/login'; // fallback if no token

    if (userRole === 'admin') return `/admin/${profileToken}`;
    if (userRole === 'contractor') return `/contractor/${profileToken}`;
    if (userRole === 'user') return `/dashboard/${profileToken}`;

    return '/login';
  };

  return (
    <nav className={`navbar ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-toggle">
        <div className="navbar-logo">
          <Link to="/" className="navbar-brand">FixFinder</Link>
        </div>

        <div className="navbar-right">
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <ul className={`navbar-links ${menuOpen ? 'show' : ''}`}>
          <li><Link to="/find-contractors">Find Contractors</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          <li><Link to="/contractor-info">Become a Contractor</Link></li>
          {isLoggedIn ? (
            <li>
              <Link to={getDashboardLink()} style={{ display: 'flex', alignItems: 'center' }}>
                <FaUserCircle style={{ marginRight: '8px', fontSize: '25px' }} />
              </Link>
            </li>
          ) : (
            <li><Link to="/register">Sign Up</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
