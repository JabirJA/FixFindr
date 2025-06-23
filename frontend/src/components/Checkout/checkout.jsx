import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Checkout.css';
import logo2 from '../../assets/man.png';
import { handleShareLocation, isValidPhone } from '../../utils/location';
import { getProfilePhotoUrl } from '../../utils/images';
import axios from 'axios';
import { formatRelativeTime } from '../../utils/dateutils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

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
  const [availability, setAvailability] = useState([]);
  const [userCoords, setUserCoords] = useState(null);

  const mapRef = useRef(null);
  const routingRef = useRef(null);
  const markersRef = useRef([]);

  const areaOptions = {
    Abuja: ["Wuse", "Asokoro", "Maitama", "Garki", "Gwarinpa", "Kuje", "Airport Road", "Lokogoma", "Kubwa", "Lugbe", "Jabi", "Utako", "Durumi", "Gudu"],
    Lagos: ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Yaba", "Ajah", "Ikorodu", "Festac", "Epe", "Badagry", "Mushin", "Ojota", "Agege", "Maryland"]
  };

  const basePrice = 5500;
  const serviceFee = 300;
  const surcharges = { Priority: 2000, Fast: 1000, Scheduled: 0 };

  const now = new Date();
  const formatOptions = { hour: 'numeric', minute: '2-digit' };

  const priorityStartStr = new Date(now.getTime() + 15 * 60 * 1000).toLocaleTimeString([], formatOptions);
  const priorityEndStr = new Date(now.getTime() + 45 * 60 * 1000).toLocaleTimeString([], formatOptions);
  const fastStartStr = new Date(now.getTime() + 50 * 60 * 1000).toLocaleTimeString([], formatOptions);
  const fastEndStr = new Date(now.getTime() + 90 * 60 * 1000).toLocaleTimeString([], formatOptions);

  const bookingOptions = [
    { id: 'Priority', label: 'Priority', time: `${priorityStartStr} - ${priorityEndStr} Today`, price: 7000 },
    { id: 'Fast', label: 'Fast', time: `${fastStartStr} - ${fastEndStr} Today`, price: 6000 },
    { id: 'Scheduled', label: 'Schedule & Save', time: 'As soon as next available', price: 5500 }
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

  useEffect(() => {
    if (bookingTime === 'Scheduled' && contractor?.contractor_id) {
      axios.get(`http://localhost:5050/contractors/availability/${contractor.contractor_id}`)
        .then(res => setAvailability(res.data))
        .catch(err => console.error('Error fetching availability:', err));
    }
  }, [bookingTime, contractor]);
  useEffect(() => {
   
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([9.05785, 7.49508], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }
  
    if (
      userCoords && userCoords.length === 2 &&
      contractor?.latitude !== undefined && contractor?.longitude !== undefined
    ) {
      // Remove existing markers
      markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
      markersRef.current = [];
  
      if (routingRef.current) {
        mapRef.current.removeControl(routingRef.current);
        routingRef.current = null;
      }
  
      // Add user marker
      const userMarker = L.marker(userCoords).addTo(mapRef.current).bindPopup('Your Location').openPopup();
      markersRef.current.push(userMarker);
  
      // Add contractor marker
      const contractorMarker = L.marker([contractor.latitude, contractor.longitude]).addTo(mapRef.current).bindPopup(contractor.name);
      markersRef.current.push(contractorMarker);
  
      // Add route
      routingRef.current = L.Routing.control({
        waypoints: [
          L.latLng(userCoords[0], userCoords[1]),
          L.latLng(contractor.latitude, contractor.longitude)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        show: false
      }).addTo(mapRef.current);
      
      // Center the map
      mapRef.current.fitBounds([
        [userCoords[0], userCoords[1]],
        [contractor.latitude, contractor.longitude]
      ]);
    }
  }, [userCoords, contractor]);
  
  const handleLocationShare = () => {
    handleShareLocation((coords) => {
      
      if (coords && coords.lat && coords.lng) {
        setUserCoords([coords.lat, coords.lng]);
        setStateInput('');
        setAreaInput('');
        setStreetInput('');
      } else {
        console.error(' Invalid coords:', coords);
      }
      
    });
  };
  

  const handleGeocodeAddress = async () => {
    if (!stateInput || !areaInput || !streetInput) {
      alert('Please fill State, Area, and Street before locating');
      return;
    }
    const query = encodeURIComponent(`${streetInput}, ${areaInput}, ${stateInput}, Nigeria`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setUserCoords([parseFloat(lat), parseFloat(lon)]);
        alert('Address located on map!');
      } else {
        alert('Unable to locate address.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      alert('Error locating address.');
    }
  };

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
    if (!stateInput && !userCoords) {
      alert('Please fill out State, Area, and Street Address or share location');
      return;
    }
    alert('Booking submitted!');
  };

  if (!contractor) {
    return <div className="checkout-container"><h2>Checkout</h2><p>No contractor selected.</p></div>;
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="contractor-summary">
        <img src={getProfilePhotoUrl(contractor) || logo2} alt="Contractor" className="contractor-photo" />
        <div>
          <h3>{contractor.name}</h3>
          <p>{contractor.services?.map(s => s.name).join(', ')}</p>
        </div>
      </div>

      <div className="booking-options">
        <label className="section-label">Choose Appointment Time:</label>
        <div className="booking-cards">
          {bookingOptions.map((opt) => {
            const disabled = !contractor.availability && opt.id !== 'Scheduled';
            return (
              <div
                key={opt.id}
                className={`booking-card ${bookingTime === opt.id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => { if (!disabled) setBookingTime(opt.id); }}
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
            <label htmlFor="scheduledDate" className="scheduled-label">Pick a time:</label>
            <select
              id="scheduledDate"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            >
              <option value="">Select a time</option>
              {availability.map((slot, i) => {
                const label = formatRelativeTime(slot.day, slot.hour);
                if (!label) return null;
                return (
                  <option key={i} value={`${slot.day} ${slot.hour}`}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      <section className="map-section">
        <h3>Service Route Map</h3>
        {!userCoords && <p>Share your location or locate by address to view route.</p>}
        
        <button onClick={handleLocationShare}>Share Current Location</button>
        <button onClick={handleGeocodeAddress}>Locate with Address</button>
        <div id="map"></div>
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
          <input type="tel" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="e.g. 08012345678" />
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
          <input type="text" value={streetInput} onChange={e => setStreetInput(e.target.value)} placeholder="Enter street address" />
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
        <a href="#!" onClick={e => { e.preventDefault(); openModal('Terms & Conditions'); }}>
          Terms & Conditions
        </a> and{' '}
        <a href="#!" onClick={e => { e.preventDefault(); openModal('Cancellation Policy'); }}>
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
