import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(loggedIn);
    setUserRole(role || '');
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin/contractors';
    if (userRole === 'contractor') return '/contractor/dashboard';
    return '/user/profile';
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
              <Link to={getDashboardLink()}>
                <span role="img" aria-label="user">👤</span> Account
              </Link>
            </li>
          ) : (
            <li><Link to="/login">Sign Up</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
