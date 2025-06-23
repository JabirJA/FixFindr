import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ContractorIntro.css';
import logo2 from '../assets/preload.png';

const ContractorIntro = () => {
  const navigate = useNavigate();
  const goToRegister = () => navigate('/register?role=contractor');

  return (
    <div className="contractor-page">

      {/* Header */}
      <header className="contractor-header">
        <h1>Earn Money Your Way with FixFinder</h1>
        <p className="subtitle">Flexible jobs. Fast pay. Total control.</p>
        <button className="cta-button" onClick={goToRegister}>Continue to Registration</button>
      </header>

      {/* Benefits Section */}
      <section className="contractor-benefits">
        <h2>Why Join FixFinder?</h2>
        <div className="benefit-cards">
          <div className="benefit-card">
            <span className="icon">📲</span>
            <h3>Be Your Own Boss</h3>
            <p>Work when and where you want across 10+ service categories.</p>
          </div>
          <div className="benefit-card">
            <span className="icon">💸</span>
            <h3>Direct Payments</h3>
            <p>Get paid fast and keep 100% of what you charge, plus tips.</p>
          </div>
          <div className="benefit-card">
            <span className="icon">📈</span>
            <h3>Grow Your Business</h3>
            <p>Build your client base with free leads and our contractor dashboard.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="contractor-how">
        <h2>How It Works</h2>
        <ol>
          <li><strong>Sign up:</strong> Register and complete your profile</li>
          <li><strong>Verify:</strong> Confirm ID and service info</li>
          <li><strong>Set availability:</strong> Choose your schedule and work area</li>
          <li><strong>Start working:</strong> Accept jobs and get paid!</li>
        </ol>
      </section>

      {/* Services Section */}
      <section className="contractor-services">
        <h2>Popular Services We’re Hiring For</h2>
        <p>Electrical • Plumbing • Painting • HVAC • Auto Repair • Tech Support • Generator Service • Handyman Tasks</p>
      </section>

      {/* Video Section */}
      <section className="contractor-video-section">
        <video controls poster={logo2} className="contractor-video">
          <source src="/videos/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="short-desc">A quick demo on how Fix Finder helps you connect with clients.</p>

      </section>
      {/* Requirements Section */}
      <section className="contractor-requirements">
        <h2>What We Expect</h2>
        <ul>
          <li>Professional, high-quality service</li>
          <li>Valid ID (NIN) and verifiable contact</li>
          <li>Punctuality and client respect</li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="contractor-faq">
        <h2>FAQs</h2>
        <ul>
          <li><strong>Do I need a license?</strong> No, but relevant experience is required.</li>
          <li><strong>Can I reject jobs?</strong> Yes — you’re in control.</li>
          <li><strong>How do I get paid?</strong> Directly to your bank or wallet.</li>
          <li><strong>Is it free?</strong> Yes — early access registration is 100% free.</li>
        </ul>
      </section>

      {/* Final CTA */}
      <footer className="contractor-footer">
        <p>Ready to get started?</p>
        <button className="cta-button" onClick={goToRegister}>Continue to Registration</button>
      </footer>
    </div>
  );
};

export default ContractorIntro;
