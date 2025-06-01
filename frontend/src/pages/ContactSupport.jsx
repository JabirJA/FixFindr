import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/ContactSupport.css';

const ContactSupport = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // You can integrate with an API or email service like EmailJS here
    console.log('Submitted:', formData);
    alert('Your message has been sent. We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="container contact-support-page">
      <h2 className="section-title" data-aos="fade-up">Contact Support</h2>

      <p className="intro" data-aos="fade-up" data-aos-delay="100">
        Need help? Reach out to our support team and we’ll respond as soon as possible.
      </p>

      <form className="contact-form" onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="200">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </label>

        <label>
          Subject
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Brief description of your issue"
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Describe your issue or feedback..."
          />
        </label>

        <button type="submit" className="submit-btn">Send Message</button>
      </form>
    </main>
  );
};

export default ContactSupport;
