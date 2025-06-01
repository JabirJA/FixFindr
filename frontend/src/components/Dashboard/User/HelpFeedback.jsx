import React, { useState } from 'react';
import './User.css';

const HelpFeedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState(null); // success or error messages

  const disputeEmail = 'disputes@yourapp.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    // simple regex email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !validateEmail(formData.email) ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setStatus({ type: 'error', msg: 'Please fill all fields with valid info.' });
      return;
    }

    // Simulate sending email or API call
    console.log('Sending feedback:', formData);

    setStatus({ type: 'success', msg: 'Thank you for your feedback!' });

    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="help-feedback-container">
      <h2>Help & Feedback</h2>
      <p>If you have any questions, issues, or feedback, please fill the form below.</p>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Subject
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject of your message"
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows={5}
            required
          />
        </label>

        <button type="submit">Send Feedback</button>
      </form>

      {status && (
        <div className={`status-message ${status.type}`}>
          {status.msg}
        </div>
      )}

      <div className="dispute-section">
        <h3>Dispute Inquiries</h3>
        <p>
          For any disputes, please email us directly at{' '}
          <a href={`mailto:${disputeEmail}`}>{disputeEmail}</a>.
        </p>
      </div>
    </div>
  );
};

export default HelpFeedback;
