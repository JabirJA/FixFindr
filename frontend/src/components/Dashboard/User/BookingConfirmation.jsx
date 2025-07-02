import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './User.css';
import { getProfilePhotoUrl } from '../../../utils/images';

const StarsRating = ({ rating, onChange }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`stars ${i <= rating ? 'filled' : ''}`}
        onClick={() => onChange(i)}
        style={{ cursor: 'pointer' }}
        role="button"
        aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onChange(i);
        }}
      >
        ★
      </span>
    );
  }
  return <div className="stars-rating">{stars}</div>;
};

const BookingConfirmation = () => {
  const location = useLocation();
  
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pastBookings, setPastBookings] = useState([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionRating, setCompletionRating] = useState(0);
  const [completionReview, setCompletionReview] = useState('');
  const [completionFeedback, setCompletionFeedback] = useState('');

  useEffect(() => {
    const storedContext = JSON.parse(localStorage.getItem('bookingContext'));
    const booking = location.state?.booking || storedContext?.booking;
    const contractor = location.state?.contractor || storedContext?.contractor;
    const userCoords = location.state?.userCoords || storedContext?.userCoords;

    if (!booking?.booking_id) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/bookings/${booking.booking_id}`);
        const updatedBooking = res.data.booking;

        setCurrentBooking({
          id: updatedBooking.booking_id,
          contractorName: contractor?.name || 'Unnamed Contractor',
          serviceType: contractor?.service_type || contractor?.services?.[0]?.name || 'N/A',
          contractorPhone: contractor?.phone_number || 'N/A',
          price: updatedBooking.total_amount || 0,
          status: updatedBooking.status || 'Pending',
          imageUrl: getProfilePhotoUrl(contractor),
          location: {
            address: updatedBooking.full_address || contractor?.address || 'Address not provided',
            mapEmbedUrl: generateMapEmbedUrl(
              [updatedBooking.user_lat, updatedBooking.user_lng],
              contractor
            )
          },
          startTime: new Date(updatedBooking.booking_date).toLocaleString()
        });
      } catch (err) {
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, []);
  const fetchPastBookings = async () => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('📦 Fetched userId from localStorage:', userId);
  
      if (!userId) {
        console.warn('⚠️ No valid user ID found for fetching bookings.');
        return;
      }
  
      const url = `http://localhost:5050/bookings/user/${userId}?status=Completed`;

  
      const res = await axios.get(url);
  
      const completed = res.data.map(b => ({
        id: b.booking_id,
        contractorName: b.contractor_name || 'Unknown Contractor',
        serviceType: b.contractor_service || '',
        date: new Date(b.booking_date).toLocaleString(),
        price: b.total_amount,
        rating: b.rating_given || 0,
        review: b.rating_note || '',
      }));

  
      setPastBookings(completed);
    } catch (err) {
      console.error('❌ Error fetching past bookings:', err);
    }
  };
  useEffect(() => {
    fetchPastBookings();
  }, []);
  

  function generateMapEmbedUrl(userCoords, contractor) {
    if (userCoords && contractor?.latitude && contractor?.longitude) {
      return `https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${userCoords[0]},${userCoords[1]}&destination=${contractor.latitude},${contractor.longitude}`;
    }
    return 'https://www.google.com/maps';
  }

  const handleReviewChange = (id, value) => {
    setPastBookings(prev =>
      prev.map(booking =>
        booking.id === id ? { ...booking, review: value } : booking
      )
    );
  };

  const handleRatingChange = (id, newRating) => {
    setPastBookings(prev =>
      prev.map(booking =>
        booking.id === id ? { ...booking, rating: newRating } : booking
      )
    );
  };

  const cancelCurrentBooking = () => {
    if (window.confirm('Are you sure you want to cancel the current booking?')) {
      setCurrentBooking(null);
    }
  };

  const handleCompleteBooking = async () => {
    // You can optionally POST review and rating to backend here
    await fetchPastBookings(); // Refresh
    setCurrentBooking(null);
    setShowCompleteModal(false);
    setCompletionRating(0);
    setCompletionReview('');
    setCompletionFeedback('');
    localStorage.removeItem('bookingContext');
    await axios.put(`http://localhost:5050/bookings/${currentBooking.id}/complete`);

  };

  if (loading) return <p>Loading booking confirmation...</p>;

  return (
    <div className="booking-confirmations-container">
      <h2>Booking Confirmation</h2>

      {currentBooking ? (
        <div className="current-booking">
          <h3>
            Current Booking:{' '}
            <span className={`status-label ${currentBooking.status.toLowerCase()}`}>
              {currentBooking.status}
            </span>
          </h3>

          <div className="booking-details-wrapper">
            <div className="booking-info">
              <div className="contractor-profile">
                <img
                  src={currentBooking.imageUrl}
                  alt={`${currentBooking.contractorName}'s profile`}
                  className="contractor-image"
                />
                <div className="contractor-info">
                  <strong>{currentBooking.contractorName}</strong>
                  <small className="service-type">{currentBooking.serviceType}</small>
                </div>
              </div>

              <p><strong>Contact:</strong> {currentBooking.contractorPhone}</p>
              <p><strong>Price:</strong> ₦{currentBooking.price.toLocaleString()}</p>
              <p><strong>Start Time:</strong> {currentBooking.startTime}</p>

              <button className="cancel-button" onClick={cancelCurrentBooking}>
                Cancel Booking
              </button>
              <button className="complete-button" onClick={() => setShowCompleteModal(true)}>
                Mark as Completed
              </button>
            </div>

            <section className="map-section">
              <h3>Location</h3>
              <p>{currentBooking.location.address}</p>
              <iframe
                src={currentBooking.location.mapEmbedUrl}
                height="300"
                allowFullScreen
                loading="lazy"
                title="Service Route Map"
                className="map-iframe"
                style={{ width: '100%', border: 0 }}
              ></iframe>
            </section>
          </div>
        </div>
      ) : (
        <p>No ongoing bookings at the moment.</p>
      )}

      <hr />

      <div className="past-bookings">
        <h3>Past Bookings</h3>
        {pastBookings.length === 0 ? (
          <p>No past bookings found.</p>
        ) : (
          <ul className="past-bookings-list">
            {pastBookings.map(booking => (
              <li key={booking.id} className="past-booking-item">
                <div className="past-booking-main">
                  <div>
                    <strong>{booking.contractorName}</strong><br />
                    <small className="service-type">{booking.serviceType}</small>
                    <div>{booking.date}</div>
                  </div>
                  <div>₦{booking.price.toLocaleString()}</div>
                </div>

                <StarsRating
                  rating={booking.rating}
                  onChange={(newRating) => handleRatingChange(booking.id, newRating)}
                />

                <textarea
                  className="review-input"
                  placeholder="Leave a review..."
                  value={booking.review}
                  onChange={(e) => handleReviewChange(booking.id, e.target.value)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Complete Booking</h3>
            <p>Please rate and review the contractor</p>

            <div className="modal-contractor-profile">
              <img
                src={currentBooking.imageUrl}
                alt={`${currentBooking.contractorName}'s profile`}
                className="contractor-image-modal"
              />
              <div className="contractor-info">
                {currentBooking.contractorName}
              </div>
            </div>

            <StarsRating rating={completionRating} onChange={setCompletionRating} />

            <textarea
              className="review-input"
              placeholder="Leave a review..."
              value={completionReview}
              onChange={(e) => setCompletionReview(e.target.value)}
            />
            <textarea
              className="review-input"
              placeholder="Any advice or feedback?"
              value={completionFeedback}
              onChange={(e) => setCompletionFeedback(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={handleCompleteBooking}>Confirm</button>
              <button onClick={() => setShowCompleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmation;
