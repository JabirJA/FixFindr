import React from 'react';
import '../style/About.css';
import logo from '../assets/logo.png';

const About = () => {
  return (
    <div className="about-container">
      <div className="logo-wrapper">
        <img className="about-logo" src={logo} alt="FixFinder Logo" />
      </div>

      <h1>About FixFinder</h1>
      <p className="intro-text">
        FixFinder is your go-to platform for discovering reliable, vetted service professionals in your area —
        from electricians and plumbers to handymen and HVAC experts.
      </p>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          We aim to make home repair and maintenance stress-free by connecting users with trusted, nearby
          contractors. Whether you're booking a quick fix or a full installation, FixFinder ensures quality and peace of mind.
        </p>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li>Browse or search for the service you need</li>
          <li>Get matched with top-rated local contractors</li>
          <li>Book a time and track progress via your dashboard</li>
          <li>Pay securely and leave a review</li>
        </ol>
      </section>

      <section className="why-us">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>🔒 Secure payments & verified professionals</li>
          <li>📅 Easy scheduling and real-time updates</li>
          <li>🌟 Transparent reviews and ratings</li>
          <li>📍 Local pros who understand your area</li>
        </ul>
      </section>


     {/* Testimonials Section */}
<section className="testimonials-section">
  <h2>What Our Users Say</h2>

  {/* User Testimonials */}
  <div className="testimonial">
    <p>“FixFinder connected me with a plumber who fixed my leaking sink the same day! Super easy and reliable.”</p>
    <strong>- Sarah W., User</strong>
  </div>
  <div className="testimonial">
    <p>“Love the dashboard! I can track my project and pay securely without any stress.”</p>
    <strong>- Mike T., User</strong>
  </div>

  <h2>What Our Contractors Say</h2>

    {/* Contractor Testimonials */}
    <div className="testimonial">
        <p>“FixFinder has increased my client base significantly. I love the ease of use and communication tools.”</p>
        <strong>- Aisha T., Plumber</strong>
    </div>
    <div className="testimonial">
        <p>“This app is a game-changer. Saved me so much time and allowed me to focus on quality work.”</p>
        <strong>- Chinedu K., Electrician</strong>
    </div>
    <div className="testimonial">
        <p>“I recommend FixFinder to all my contractor friends. The platform makes booking straightforward and reliable.”</p>
        <strong>- Grace N., HVAC Specialist</strong>
    </div>
    </section>


      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Fix It?</h2>
        <p>Join thousands of satisfied customers finding trusted contractors near you today.</p>
        <a href="/register" className="cta-button">Create an Account</a>
      </section>
    </div>
  );
};

export default About;
