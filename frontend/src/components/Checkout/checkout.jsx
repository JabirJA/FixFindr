import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Checkout.css';
import logo2 from '../../assets/man.png';
import { handleShareLocation, isValidPhone } from '../../utils/location';

const Checkout = () => {
  const location = useLocation();
  const contractor = location.state?.contractor;

  const [user, setUser] = useState(null);
  const [bookingTime, setBookingTime] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsText, setTermsText] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [stateInput, setStateInput] = useState('');
  const [areaInput, setAreaInput] = useState('');
  const [streetInput, setStreetInput] = useState('');
  const isUnavailable = contractor.status === 'unavailable';

  const areaOptions = {
    Abuja: ["Wuse", "Asokoro", "Maitama", "Garki", "Gwarinpa", "Kuje", "Airport Road", "Lokogoma", "Kubwa", "Lugbe", "Jabi", "Utako", "Durumi", "Gudu"],
    Lagos: ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Yaba", "Ajah", "Ikorodu", "Festac", "Epe", "Badagry", "Mushin", "Ojota", "Agege", "Maryland"]
  };

  const basePrice = 5500;
  const serviceFee = 300;
  const surcharges = {
    Priority: 2000,
    Fast: 1000,
    Scheduled: 0,
  };

  const bookingOptions = [
    { id: 'Priority', label: 'Priority', time: '5:08 PM - 5:53 PM Today', price: 7000 },
    { id: 'Fast', label: 'Fast', time: '6:30 PM - 7:15 PM Today', price: 6000 },
    { id: 'Scheduled', label: 'Schedule & Save', time: 'As soon as 9:00 AM Tomorrow', price: 5500 },
  ];

  const scheduleOptions = [
    'Tomorrow 9:00 AM',
    'Tomorrow 11:00 AM',
    'Day after tomorrow 2:00 PM',
    'In 3 days 10:00 AM',
    'In 4 days 1:00 PM'
  ];

  const total = basePrice + serviceFee + (surcharges[bookingTime] || 0);

  useEffect(() => {
    const fetchUser = async () => {
      const profileToken = localStorage.getItem('profileToken');
      if (!profileToken) return;
      try {
        const res = await fetch(`/user/dashboard/${profileToken}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser({
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
          address: data.address,
          phone: data.phone,
        });
        setAddressInput(data.address || '');
        setPhoneInput(data.phone || '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const openModal = (title) => {
    setModalTitle(title);
    fetch(`/terms/${title === 'Terms & Conditions' ? 'user-terms.txt' : 'cancellation.txt'}`)
      .then(res => res.text())
      .then(setTermsText)
      .catch(() => setTermsText('Unable to load terms.'));
    setShowTermsModal(true);
  };

  const onSubmit = () => {
    if (!isValidPhone(phoneInput)) {
      alert('Please enter a valid Nigerian phone number');
      return;
    }
    if (!stateInput || !areaInput || !streetInput) {
      alert('Please fill out State, Area, and Street Address');
      return;
    }
    alert('Booking submitted!');
  };

  const handleLocationShare = () => {
    handleShareLocation(() => {
      setStateInput('Abuja');
      setAreaInput('Gwarinpa');
      setStreetInput('12 Aminu Kano Crescent');
    });
  };

  if (!contractor) {
    return <div className="checkout-container"><h2>Checkout</h2><p>No contractor selected.</p></div>;
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="contractor-summary">
        <img src={contractor.image || logo2} alt="Contractor" className="contractor-photo" />
        <div>
          <h3>{contractor.name}</h3>
          <p>{contractor.services?.map(s => s.name).join(', ')}</p>
        </div>
      </div>

      <div className="booking-options">
        <label className="section-label">Choose Appointment Time:</label>
        <div className="booking-cards">
          {bookingOptions.map((opt) => {
            const disabled = !contractor.isAvailable && opt.id !== 'Scheduled';
            return (
              <div
                key={opt.id}
                className={`booking-card ${bookingTime === opt.id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => {
                  if (!disabled) setBookingTime(opt.id);
                }}
              >
                <div className="booking-info">
                  <h4>{opt.label}</h4>
                  <p>{opt.time}</p>
                </div>
                <span className="booking-price">₦{opt.price.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        {bookingTime === 'Scheduled' && (
          <div className="schedule-dropdown">
            <label htmlFor="scheduledDate">Pick a time:</label>
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
        <h3>Service Location</h3>
        <p>{contractor.location?.address || '12 Aminu St, Ibadan'}</p>
        <iframe
          src={contractor.location?.mapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.9197299327824!2d3.895393714755193!3d7.377535994675872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1039ecfe0b260beb%3A0x7b5475ae7b556927!2s12%20Aminu%20St%2C%20Ibadan!5e0!3m2!1sen!2sng!4v1682047303036!5m2!1sen!2sng"}
          height="300"
          loading="lazy"
          title="Contractor Location"
          className="map-iframe"
        ></iframe>
      </section>

      <section className="checkout-booking-details">
        <h3>Booking Details</h3>
        <div className="booking-detail-row">
          <label>Full Name:</label>
          <span>{user ? user.name : 'Loading...'}</span>
        </div>
        <div className="booking-detail-row">
          <label>Email:</label>
          <span>{user ? user.email : 'Loading...'}</span>
        </div>
        <div className="booking-detail-row">
          <label>Phone:</label>
          <input 
            type="tel"
            value={phoneInput}
            onChange={e => setPhoneInput(e.target.value)}
            placeholder="e.g. 08012345678"
          />
        </div>
        <div className="booking-detail-row">
          <label>State:</label>
          <select value={stateInput} onChange={e => setStateInput(e.target.value)}>
            <option value="">Select State</option>
            <option value="Abuja">Abuja</option>
            <option value="Lagos">Lagos</option>
          </select>
        </div>
        <div className="booking-detail-row">
          <label>Area:</label>
          <input 
            list="area-list"
            value={areaInput}
            onChange={e => setAreaInput(e.target.value)}
            placeholder="Type Area..."
            disabled={!stateInput}
          />
          <datalist id="area-list">
            {stateInput && areaOptions[stateInput]?.map((area, i) => (
              <option key={i} value={area} />
            ))}
          </datalist>
        </div>
        <div className="booking-detail-row">
          <label>Street Address:</label>
          <input 
            type="text"
            value={streetInput}
            onChange={e => setStreetInput(e.target.value)}
            placeholder="Enter street address"
          />
        </div>
        <div className="booking-detail-row">
          <label>Location Share:</label>
          <button onClick={handleLocationShare}>Share Current Location</button>
        </div>
      </section>

      <div className="checkout-breakdown">
        <h3>Summary:</h3>
        <div className="checkout-breakdown-row">
          <label>Base Price</label>
          <span className="price">₦{basePrice.toLocaleString()}</span>
        </div>
        <div className="checkout-breakdown-row">
          <label>Service Fee</label>
          <span className="price">₦{serviceFee.toLocaleString()}</span>
        </div>
        <div className="checkout-breakdown-row">
          <label>Priority Fee</label>
          <span className="price">
            {surcharges[bookingTime] === 0 ? 'FREE' : `₦${surcharges[bookingTime]?.toLocaleString()}`}
          </span>
        </div>
        <div className="checkout-breakdown-row total">
          <label>Total</label>
          <span className="price">₦{total.toLocaleString()}</span>
        </div>
      </div>

      <button className="checkout-button" onClick={onSubmit}>
        Pay ₦{total.toLocaleString()}
      </button>

      <p className="checkout-terms">
        By confirming, you agree to our{' '}
        <a href="#!" onClick={(e) => { e.preventDefault(); openModal('Terms & Conditions'); }}>
          Terms & Conditions
        </a> and{' '}
        <a href="#!" onClick={(e) => { e.preventDefault(); openModal('Cancellation Policy'); }}>
          Cancellation Policy
        </a>.
      </p>

      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{modalTitle}</h2>
            <pre>{termsText}</pre>
            <button className="modal-close-button" onClick={() => setShowTermsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
