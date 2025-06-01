import React, { useState } from 'react';
import './User.css';
import logo2 from '../../../assets/man.png';
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
        aria-label={`Rate ${i} stars${i > 1 ? 's' : ''}`}
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
    const [currentBooking, setCurrentBooking] = useState({
        id: 'abc123',
        contractorName: 'John Doe',
        serviceType: 'Mechanic',
        contractorPhone: '555-123-4567',
        price: 150,
        status: 'Ongoing',
        imageUrl: logo2, // <-- NEW LINE
        location: {
          address: '123 Main St, Abuja, Nigeria',
          mapEmbedUrl:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.123456789!2d7.49508!3d9.05785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0a123456789%3A0xabcdef123456789!2s123%20Main%20St%2C%20Abuja%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1610000000000!5m2!1sen!2sng',
        },
        startTime: '2025-05-20 10:00 AM',
      });
      

  const [pastBookings, setPastBookings] = useState([
    {
      id: 'xyz789',
      contractorName: 'Sarah Lee',
      serviceType: 'Electrician',
      date: '2025-04-15 2:00 PM',
      price: 120,
      saved: false,
      rating: 4,
      review: '',
    },
    {
      id: 'def456',
      contractorName: 'Mark Smith',
      serviceType: 'Plumber',
      date: '2025-03-22 11:30 AM',
      price: 100,
      saved: true,
      rating: 5,
      review: 'Great work, very professional!',
    },
  ]);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionRating, setCompletionRating] = useState(0);
  const [completionReview, setCompletionReview] = useState('');
  const [completionFeedback, setCompletionFeedback] = useState('');

  const handleReviewChange = (id, value) => {
    setPastBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, review: value } : booking
      )
    );
  };

  const handleRatingChange = (id, newRating) => {
    setPastBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, rating: newRating } : booking
      )
    );
  };

  const cancelCurrentBooking = () => {
    if (window.confirm('Are you sure you want to cancel the current booking?')) {
      setCurrentBooking(null);
    }
  };

  const handleCompleteBooking = () => {
    setPastBookings((prev) => [
      {
        id: currentBooking.id,
        contractorName: currentBooking.contractorName,
        serviceType: currentBooking.serviceType,
        date: currentBooking.startTime,
        price: currentBooking.price,
        rating: completionRating,
        review: completionReview,
        feedback: completionFeedback,
        saved: false,
      },
      ...prev,
    ]);
    setCurrentBooking(null);
    setShowCompleteModal(false);
    setCompletionRating(0);
    setCompletionReview('');
    setCompletionFeedback('');
  };

  return (
    <div className="booking-confirmations-container">
      <h2>Booking Confirmations</h2>

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
              <p><strong>Price:</strong> ₦{currentBooking.price.toFixed(2)}</p>
              <p><strong>Start Time:</strong> {currentBooking.startTime}</p>

              <button className="cancel-button" onClick={cancelCurrentBooking}>
                Cancel Booking
              </button>
              <button className="complete-button" onClick={() => setShowCompleteModal(true)}>
                Mark as Completed
              </button>
            </div>

            <section className="map-section">
              <h2>Location</h2>
              <p>{currentBooking.location.address}</p>
              <iframe
                src={currentBooking.location.mapEmbedUrl}
                height="300"
                allowFullScreen=""
                loading="lazy"
                title="Contractor Location"
                className="map-iframe"
                style={{ width: '100%', border: 0 }}
              ></iframe>
            </section>

            <section className="chat-section">
              <h3>Current Chat</h3>
              <div className="chat-box">
                <p><strong>{currentBooking.contractorName}:</strong> Please arrive by 10 AM.</p>
                <p><strong>You:</strong> Sure! I’m on my way now.</p>
                <input type="text" placeholder="Type a message..." />
              </div>
              <button className="call-button" onClick={() => window.open(`tel:${currentBooking.contractorPhone}`)}>
                Call Contractor
              </button>
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
            {pastBookings.map((booking) => (
              <li key={booking.id} className="past-booking-item">
                <div className="past-booking-main">
                  <div>
                    <strong>{booking.contractorName}</strong><br />
                    <small className="service-type">{booking.serviceType}</small>
                    <div>{booking.date}</div>
                  </div>
                  <div>₦{booking.price.toFixed(2)}</div>
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

      {currentBooking && (
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
      )}

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
