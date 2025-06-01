import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/SafetyGuidelines.css'; // Create this CSS file for styling

const SafetyGuidelines = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <main className="container safety-guidelines-page">
      <h2 className="section-title" data-aos="fade-up">Safety Guidelines</h2>

      <p data-aos="fade-up" data-aos-delay="100">
        At FixFinder, your safety is our top priority. Whether you're a homeowner or a contractor, please follow these safety guidelines to ensure a secure and respectful experience.
      </p>

      <section className="guideline-section" data-aos="fade-up" data-aos-delay="200">
        <h3>For Customers</h3>
        <ul>
          <li>🔒 Always verify the contractor’s ID before allowing them into your home.</li>
          <li>👥 Prefer having another adult present during the service, especially for first-time visits.</li>
          <li>📝 Clearly communicate your expectations and job details before work begins.</li>
          <li>💳 Make payments only through the FixFinder platform to ensure secure transactions.</li>
          <li>📱 Use the in-app chat and tracking features to monitor progress and stay informed.</li>
        </ul>
      </section>

      <section className="guideline-section" data-aos="fade-up" data-aos-delay="300">
        <h3>For Contractors</h3>
        <ul>
          <li>🪪 Carry valid identification and show it when requested.</li>
          <li>👔 Dress professionally and act respectfully at all times.</li>
          <li>📲 Always use the app to communicate with clients and log job progress.</li>
          <li>🛠️ Only perform tasks agreed upon in the app; avoid making unauthorized changes.</li>
          <li>🧾 Leave the work area clean and provide receipts or reports when necessary.</li>
        </ul>
      </section>

      <section className="guideline-section" data-aos="fade-up" data-aos-delay="400">
        <h3>General Tips</h3>
        <ul>
          <li>🚨 Report suspicious activity immediately using our support form or in-app help.</li>
          <li>⚠️ Avoid sharing personal contact information outside of the FixFinder platform.</li>
          <li>📍 Always confirm service locations and times before dispatch or arrival.</li>
          <li>🧯 Make sure basic safety equipment (fire extinguisher, first aid kit) is accessible.</li>
        </ul>
      </section>

      <p className="disclaimer" data-aos="fade-up" data-aos-delay="500">
        FixFinder strives to create a trustworthy environment, but the final responsibility lies with users to exercise judgment and caution during all interactions.
      </p>
    </main>
  );
};

export default SafetyGuidelines;
