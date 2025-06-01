import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <main className="container privacy-policy-page">
      <h2 className="section-title" data-aos="fade-down">Privacy Policy</h2>

      <p data-aos="fade-up">
        At FixFinder, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, store, and safeguard your data.
      </p>

      <section data-aos="fade-up">
        <h3>1. Information We Collect</h3>
        <p>We collect the following types of information:</p>
        <ul>
          <li>Personal Information (e.g., name, email, phone number)</li>
          <li>Location Data (to match you with nearby contractors)</li>
          <li>Payment Details (processed securely via third-party providers)</li>
          <li>Service Usage Data (to improve our platform and features)</li>
        </ul>
      </section>

      <section data-aos="fade-up">
        <h3>2. How We Use Your Information</h3>
        <p>Your information is used to:</p>
        <ul>
          <li>Connect you with local contractors</li>
          <li>Provide customer support</li>
          <li>Improve our services and user experience</li>
          <li>Send important updates and promotions (opt-in only)</li>
        </ul>
      </section>

      <section data-aos="fade-up">
        <h3>3. Sharing Your Information</h3>
        <p>
          We do <strong>not</strong> sell or rent your personal information. We may share it with:
        </p>
        <ul>
          <li>Contractors you choose to hire</li>
          <li>Trusted third-party service providers (e.g., payment processors)</li>
          <li>Authorities if required by law or for fraud prevention</li>
        </ul>
      </section>

      <section data-aos="fade-up">
        <h3>4. Data Security</h3>
        <p>
          We implement industry-standard encryption, access control, and secure servers to protect your data. However, no online system is 100% secure.
        </p>
      </section>

      <section data-aos="fade-up">
        <h3>5. Your Rights & Choices</h3>
        <p>You can:</p>
        <ul>
          <li>Access or update your personal information</li>
          <li>Request deletion of your account</li>
          <li>Opt out of promotional emails</li>
        </ul>
      </section>

      <section data-aos="fade-up">
        <h3>6. Cookies & Tracking</h3>
        <p>
          We use cookies to personalize content, track usage, and improve our services. You can disable cookies in your browser settings if preferred.
        </p>
      </section>

      <section data-aos="fade-up">
        <h3>7. Changes to This Policy</h3>
        <p>
          We may update this Privacy Policy periodically. Changes will be posted on this page with the revised date.
        </p>
      </section>

      <section data-aos="fade-up">
        <h3>8. Contact Us</h3>
        <p>
          If you have questions or concerns about your privacy, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> support@fixfinder.com<br />
          <strong>Phone:</strong> +1 (800) 123-4567
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
