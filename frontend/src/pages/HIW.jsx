import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import logo from '../assets/logo.png'; // Uncomment and fix path if you have a logo image
import '../style/HIW.css';
import logo from '../assets/preload.png';

const HIW = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <main className="container how-it-works-page">
      <h2 className="section-title">How FixFinder Works</h2>

      <p>
        FixFinder connects you with trusted local contractors in real-time. You can search for professionals
        based on your needs and location, and if there are any questions about pricing or service details,
        you settle those directly with the contractor. Our platform makes it easy to track arrivals, communicate,
        and securely pay — all from one convenient and reliable dashboard.
      </p>

      <h2 className="section-title">Watch How It Works</h2>
      <section className="video-demo" data-aos="fade-up">
        <video
          controls
          width="100%"
          style={{ borderRadius: '12px', maxWidth: '800px', margin: '0 auto', display: 'block' }}
          preload="none"
          poster={logo} // add a relevant poster image if you have one
        >
          <source src="/videos/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="short-desc">A quick demo on how Fix Finder connects you to verified contractors. </p>
      </section>

      <div className="steps">
        <div className="step" data-aos="zoom-in">
          <div className="icon-circle blue">1</div>
          <p>Search for a service</p>
          <p className="description">Browse local contractors based on your specific needs and location.</p>
        </div>

        <div className="step" data-aos="zoom-in" data-aos-delay="100">
          <div className="icon-circle green">✔</div>
          <p>Choose a contractor near you</p>
          <p className="description">Find verified professionals ready to help, with real-time tracking and direct communication.</p>
        </div>

        <div className="step" data-aos="zoom-in" data-aos-delay="200">
          <div className="icon-circle amber">$</div>
          <p>Complete the job with confidence</p>
          <p className="description">Settle pricing or any disputes directly with the contractor, then pay securely through our platform once satisfied.</p>
        </div>
      </div>
    </main>
  );
};

export default HIW;
