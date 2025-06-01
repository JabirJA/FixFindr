import React, { useEffect, useState } from 'react';
import AOS from 'aos';

import 'aos/dist/aos.css';
import './HomePage.css';

import icon from '../../assets/icon.png';
import logo from '../../assets/preload.png';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import mechanicImg from '../../assets/mechanic.png';
import electricianImg from '../../assets/electrician.png';
import plumberImg from '../../assets/plumber.png';
import CarpenterImg from '../../assets/carpenter.png';
import ACrepairImg from '../../assets/acrepair.png';
import SERVICES from '../../pages/services';
// Add more images as needed

const services = [
  { name: 'Mechanic', img: mechanicImg },
  { name: 'Electrician', img: electricianImg },
  { name: 'Plumber', img: plumberImg },
  { name: 'AC Repair', img: ACrepairImg },
  { name: 'Carpenter', img: CarpenterImg },
  { name: '+ More', img: icon},
  // Add more services with images
];

const Homepage = () => {
  const [suggestions, setSuggestions] = useState([]);
const [isSearching, setIsSearching] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);


  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
  
    // Scroll into view (optional)
    const inputElement = document.getElementById('search-input');
    if (inputElement) inputElement.scrollIntoView({ behavior: 'smooth' });
  
    // Normalize SERVICES to lowercase for comparison
    const knownServices = SERVICES.map(service => service.toLowerCase());
  
    if (trimmedQuery && knownServices.includes(trimmedQuery)) {
      navigate(`/find-contractors/${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate('/find-contractors');
    }
  };
  

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }
  
    const filtered = SERVICES.filter(service =>
      service.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filtered);
  }, [searchQuery]);
  
  
  return (
    <>
      <Helmet>
        <title>Fix Finder | Find Skilled Contractors Near You</title>
        <meta
          name="description"
          content="Find reliable, verified professionals near you for home and auto services. Mechanics, plumbers, electricians and more."
        />
      </Helmet>

      <header className="hero">
        <div className="hero-content">
          <h1 className="title">Get help from skilled contractors near you</h1>

          <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a service or contractor"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              aria-label="Search services or contractors"
            />
            {isSearching && <div className="spinner" />}
          </div>

          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    navigate(`/find-contractors/${encodeURIComponent(suggestion)}`);
                  }}
                  
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}

          <div className="search-button">
            <img
              src={icon}
              alt="Search"
              onClick={handleSearch}
              className="search-icon"
            />
          </div>
        </div>
          <div className="how-it-works">
            <div className="step" data-aos="zoom-in">
              <div className="icon-circle">1</div>
              <p>Search for a service</p>
            </div>
            <div className="step" data-aos="zoom-in" data-aos-delay="100">
              <div className="icon-circle">✔</div>
              <p>Choose a contractor</p>
            </div>
            <div className="step" data-aos="zoom-in" data-aos-delay="200">
              <div className="icon-circle">$</div>
              <p>Get the job done</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="section-title">Popular Services</h2>
        <section className="service-carousel-container" data-aos="fade-up">
  <div className="service-carousel">
    {services.map((service, index) => (
      <div
        className="service-card"
        key={index}
        data-aos="zoom-in"
        data-aos-delay={index * 100}
        onClick={() => {
          if (service.name === '+ More') {
            navigate('/find-contractors');
          } else {
            const formatted = encodeURIComponent(service.name.toLowerCase().replace(/\s+/g, '-'));
            navigate(`/find-contractors/${formatted}`);
          }
        }}
      >
        <div
          className="service-card-image"
          style={{ backgroundImage: `url(${service.img})` }}
        ></div>
        <div className="service-card-text">
          <h3>{service.name}</h3>
        </div>
      </div>
    ))}
  </div>
</section>
        <div className="cta" data-aos="fade-up">
          <button className="find-nearby-btn" onClick={() => navigate('/find-contractors')}>
            Find Contractors Near Me
          </button>
        </div>

        <h2 className="section-title">Watch How It Works</h2>
        <section className="video-demo" data-aos="fade-up">
          <video
            controls
            width="100%"
            style={{ borderRadius: '12px', maxWidth: '800px', margin: '0 auto', display: 'block' }}
            preload="none"
            poster={logo}
          >
            <source src="/videos/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="short-desc">A quick demo on how Fix Finder connects you to verified contractors. </p>
        </section>

        <button className="find-nearby-btn" onClick={() => navigate('/Register')}>
          Get Started
        </button>

        <section className="testimonials">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card" data-aos="flip-left">
              <p>"Found a plumber within minutes and he fixed my leak the same day!"</p>
              <h4>– Aisha T.</h4>
            </div>
            <div className="testimonial-card" data-aos="flip-left" data-aos-delay="100">
              <p>"This app is a game-changer. Saved me so much time and money."</p>
              <h4>– Chinedu K.</h4>
            </div>
            <div className="testimonial-card" data-aos="flip-left" data-aos-delay="200">
              <p>"I recommend this to all my friends. The electricians here are top-notch."</p>
              <h4>– Grace N.</h4>
            </div>
          </div>
        </section>

        <section className="become-contractor" data-aos="fade-up">
          <h2 className="section-title">Are You a Skilled Contractor?</h2>
          <p>Join our growing network and get matched with clients near you.</p>
          <button className="cta-btn" onClick={() => navigate('/contractor-info')}>
            Become a Contractor
          </button>
        </section>

        <section className="why-us">
          <h2 className="section-title">Why Choose Fix Finder?</h2>

          <div className="why-us-grid">
            <div className="why-us-card">
              <div className="why-us-icon">⚡</div>
              <p className="why-us-text">Fast & easy contractor matching based on your needs.</p>
            </div>

            <div className="why-us-card">
              <div className="why-us-icon">🔒</div>
              <p className="why-us-text">Verified professionals with secure communication.</p>
            </div>

            <div className="why-us-card">
              <div className="why-us-icon">💬</div>
              <p className="why-us-text">Trusted by real users with honest reviews & ratings.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Homepage;
