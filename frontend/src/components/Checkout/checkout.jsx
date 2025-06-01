import React, { useState, useEffect } from 'react';
import './Checkout.css';
import logo2 from '../../assets/man.png';

const Checkout = () => {
  const [promoCode, setPromoCode] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsText, setTermsText] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const basePrice = 5500;
  const serviceFee = 300;
  const surcharges = {
    Priority: 2000,
    Fast: 1000,
    Scheduled: 0,
  };

  const scheduleOptions = [
    'Tomorrow 9:00 AM',
    'Tomorrow 11:00 AM',
    'Day after tomorrow 2:00 PM',
    'In 3 days 10:00 AM',
    'In 4 days 1:00 PM'
  ];

  const total = basePrice + serviceFee + (surcharges[bookingTime] || 0);

  const bookingOptions = [
    {
      id: 'Priority',
      label: 'Priority',
      icon: '⚡',
      time: '5:08 PM - 5:53 PM Today',
      price: 7000,
    },
    {
      id: 'Fast',
      label: 'Fast',
      icon: '🚀',
      time: '6:30 PM - 7:15 PM Today',
      price: 6000,
    },
    {
      id: 'Scheduled',
      label: 'Schedule & Save',
      icon: '📅',
      time: 'As soon as 9:00 AM Tomorrow',
      price: 5500,
    },
  ];

  const fetchTerms = async (fileName) => {
    try {
      const response = await fetch(`/terms/${fileName}`);
      const text = await response.text();
      setTermsText(text);
    } catch (error) {
      console.error('Failed to load terms:', error);
      setTermsText('Unable to load terms and conditions.');
    }
  };

  const openModal = (type) => {
    setModalTitle(type);
    const fileName = type === 'Terms & Conditions' ? 'user-terms.txt' : 'cancellation.txt';
    fetchTerms(fileName);
    setShowTermsModal(true);
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="contractor-summary">
        <img src={logo2} alt="Contractor" className="contractor-photo" />
        <div>
          <h3>John Doe</h3>
          <p>Engine Repair Specialist</p>
        </div>
      </div>

      <div className="booking-options">
        <label className="section-label">Choose Appointment Time:</label>
        <div className="booking-cards">
          {bookingOptions.map((opt) => (
            <div
              key={opt.id}
              className={`booking-card ${bookingTime === opt.id ? 'selected' : ''}`}
              onClick={() => setBookingTime(opt.id)}
            >
              <div className="booking-icon">{opt.icon}</div>
              <div className="booking-info">
                <h4>{opt.label}</h4>
                <p>{opt.time}</p>
              </div>
              <span className="booking-price">₦{opt.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {bookingTime === 'Scheduled' && (
          <div className="schedule-dropdown">
            <label className="scheduledDate" htmlFor="scheduledDate">Pick a time:</label>
            <select
              id="scheduledDate"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            >
              <option value="">Select a time</option>
              {scheduleOptions.map((time, i) => (
                <option key={i} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <section className="map-section">
        <h2>Location</h2>
        <p>12 Aminu St, Ibadan</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.9197299327824!2d3.895393714755193!3d7.377535994675872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1039ecfe0b260beb%3A0x7b5475ae7b556927!2s12%20Aminu%20St%2C%20Ibadan!5e0!3m2!1sen!2sng!4v1682047303036!5m2!1sen!2sng"
          height="300"
          allowFullScreen=""
          loading="lazy"
          title="Contractor Location"
          className="map-iframe"
        ></iframe>
        <div className="checkout-travel-time">15 min arrival</div>
      </section>

      <section className="checkout-booking-details">
        <h3>Booking Details</h3>
        <p><span className="checkout-icon">📍</span> 12 Aminu St, Ibadan</p>
        <p>
          <span className="checkout-icon">🧰</span> Engine Failure
          <span className="price">₦{basePrice.toLocaleString()}</span>
        </p>
      </section>

      <input
        type="text"
        placeholder="Promo Code"
        className="checkout-input"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
      />

      <div className="checkout-breakdown">
        <p>Base Price: ₦{basePrice.toLocaleString()}</p>
        <p>Service Fee: ₦{serviceFee.toLocaleString()}</p>
        {surcharges[bookingTime] > 0 && (
          <p>Surcharge: ₦{surcharges[bookingTime].toLocaleString()}</p>
        )}
        <p className="total">Total: ₦{total.toLocaleString()}</p>
      </div>

      <button className="checkout-button" onClick={() => openModal('Terms & Conditions')}>
        Pay ₦{total.toLocaleString()}
      </button>

      <p className="checkout-terms">
        By confirming, you agree to our{' '}
        <a href="#!" onClick={() => openModal('Terms & Conditions')}>
          Terms & Conditions
        </a>{' '}
        and{' '}
        <a href="#!" onClick={() => openModal('Cancellation Policy')}>
          Cancellation Policy
        </a>.
      </p>

      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalTitle}</h2>
            <div className="modal-text">
              <pre>{termsText}</pre>
            </div>
            <button className="modal-close-button" onClick={() => setShowTermsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
