
import './Footer.css'; // Make sure you create this or update the path if needed
import logo2 from '../../assets/logo.png'; // Adjust path if logo.png is elsewhere
import { Link } from 'react-router-dom';
import React, { useContext} from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { ThemeContext } from '../../pages/ThemeProvider';

 
const Footer = () => {
 const {theme, toggleTheme} = useContext(ThemeContext);
  
  return (
    <footer className="footer-extended">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={logo2} alt="Contractor Finder Logo" />
          <h2>Fix Finder</h2>
          <p>Your trusted local contractor finder.</p>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link to="/About">About Us</Link></li>
              <li><a href="https://www.thesolosystem.com/" target="_blank" rel="noopener noreferrer">The Solo System</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><a href="/contractor-info">Become a Contractor</a></li>
              <li><a href="/register">Create Account</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="/how-it-works">How It Works</a></li>
              <li><Link to="/safety-guidelines">Safety Guidelines</Link></li>
              <li><Link to="/contact-support">Contact Support</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
            <li><a href="/terms/contractor">Contractor Terms</a></li>
            <li><a href="/terms/user">User Terms</a></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="footer-column">

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <><FaSun /> </> : <><FaMoon /> </>}
          </button>
        </div>

        </div>
      </div>

      <div className="footer-bottom">
        <p>Payments accepted: Visa, MasterCard, OPay, and more.</p>
        <p>© {new Date().getFullYear()} Fix Finder. Powered by The Solo System.</p>
      </div>
    </footer>
  );
};

export default Footer;
