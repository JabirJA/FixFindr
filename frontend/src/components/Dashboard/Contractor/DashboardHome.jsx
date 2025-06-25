import React, { useEffect, useState } from 'react';
import './DashboardHome.css';
import logo2 from '../../../assets/logo2.png';

const DashboardHome = () => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionFeedback, setCompletionFeedback] = useState('');
  const [jobCompleted, setJobCompleted] = useState(false);
  const [modalJob, setModalJob] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { from: 'Client', text: 'Please don’t be late.' },
    { from: 'You', text: 'Already en route.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const [currentBooking, setCurrentBooking] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([
    {
      id: 3,
      client: 'Emeka Obi',
      date: '2025-06-05T09:00',
      description: 'Repair plumbing issue',
      location: '12 Independence Rd, Enugu',
    },
    {
      id: 4,
      client: 'Ngozi Okafor',
      date: '2025-06-06T11:00',
      description: 'Install CCTV system',
      location: '87 Freedom Street, Ibadan',
    },
  ]);

  const [upcomingJobs, setUpcomingJobs] = useState([
    {
      id: 1,
      client: 'Ibrahim Musa',
      date: '2025-06-01T10:00',
      description: 'Fix generator',
      location: '456 Palm Avenue, Abuja',
    },
    {
      id: 2,
      client: 'Aisha Bello',
      date: '2025-06-03T14:30',
      description: 'Install AC unit',
      location: '22 Unity Street, Kaduna',
    },
  ]);

  // ⬇️ Load current booking from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem('bookingContext');
    if (stored) {
      try {
        const { booking, contractor, userCoords } = JSON.parse(stored);
        if (!booking || !contractor) return;

        const mapUrl = contractor.latitude && contractor.longitude && userCoords
          ? `https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${userCoords[0]},${userCoords[1]}&destination=${contractor.latitude},${contractor.longitude}`
          : 'https://maps.google.com/maps';

        setCurrentBooking({
          id: booking.booking_id,
          contractorName: contractor.name,
          serviceType: contractor.service_type || 'Unknown',
          contractorPhone: contractor.phone_number || 'N/A',
          price: booking.total_amount || 0,
          status: booking.status || 'Pending',
          imageUrl: logo2,
          location: {
            address: booking.full_address || 'Unknown address',
            mapEmbedUrl: mapUrl,
          },
          startTime: new Date(booking.booking_date).toLocaleString(),
        });
      } catch (err) {
        console.error('Error parsing bookingContext:', err);
      }
    }
  }, []);

  const handleAccept = (jobId) => {
    const job = pendingJobs.find((j) => j.id === jobId);
    if (job) {
      setUpcomingJobs((prev) => [...prev, job]);
      setPendingJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  const handleReject = (jobId) => {
    setPendingJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const startJob = (job) => {
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(job.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    setCurrentBooking({
      id: job.id,
      contractorName: job.client,
      serviceType: job.description,
      contractorPhone: 'N/A',
      price: 'TBD',
      status: 'Ongoing',
      imageUrl: logo2,
      location: {
        address: job.location,
        mapEmbedUrl: mapUrl,
      },
      startTime: new Date(job.date).toLocaleString(),
    });
    setUpcomingJobs((prev) => prev.filter((j) => j.id !== job.id));
    setJobCompleted(false);
    setModalJob(null);
    setChatMessages([
      { from: 'Client', text: 'Please don’t be late.' },
      { from: 'You', text: 'Already en route.' },
    ]);
    setChatInput('');
  };

  const getAreaFromLocation = (location) => {
    const parts = location.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : location;
  };

  const getTimeRemaining = (dateStr) => {
    const jobDate = new Date(dateStr);
    const now = new Date();
    const diff = jobDate - now;
    if (diff <= 0) return 'Starting soon';

    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 60) return `in ${mins} minute${mins !== 1 ? 's' : ''}`;
    if (hours < 24) return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
    return `in ${days} day${days !== 1 ? 's' : ''}`;
  };

  const sendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages((prev) => [...prev, { from: 'You', text: chatInput }]);
      setChatInput('');
    }
  };

  return (
    <div className="dashboard-container-row">
      {/* Current Job */}
      <section className="section current-job">
        <h2>Current Job</h2>
        {!jobCompleted && currentBooking ? (
          <>
            <p><strong>Service:</strong> {currentBooking.serviceType}</p>
            <p><strong>Client:</strong> {currentBooking.contractorName}</p>
            <p><strong>Phone:</strong> {currentBooking.contractorPhone}</p>
            <p><strong>Start Time:</strong> {currentBooking.startTime}</p>
            <p><strong>Price:</strong> ₦{currentBooking.price}</p>
            <p><strong>Status:</strong> {currentBooking.status}</p>

            <div className="chat-section">
              <h3>Current Chat</h3>
              <div className="chat-box">
                {chatMessages.map((msg, i) => (
                  <p key={i}><strong>{msg.from}:</strong> {msg.text}</p>
                ))}
              </div>
              <input
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
              <button onClick={() => setShowCompletionModal(true)}>Mark as Complete</button>
            </div>
          </>
        ) : (
          <p>No current job at the moment.</p>
        )}
      </section>

      {/* Location */}
      {!jobCompleted && currentBooking && (
        <section className="section map-section">
          <h2>Location</h2>
          <p>{currentBooking.location.address}</p>
          <iframe
            src={currentBooking.location.mapEmbedUrl}
            height="300"
            allowFullScreen
            loading="lazy"
            title="Contractor Location"
            className="map-iframe"
            style={{ width: '100%', border: 0 }}
          ></iframe>
        </section>
      )}

      {/* Pending Jobs */}
      <section className="section pending-jobs">
        <h2>Pending Jobs</h2>
        {pendingJobs.length === 0 ? (
          <p>No pending jobs.</p>
        ) : (
          <ul>
            {pendingJobs.map((job) => (
              <li key={job.id} className="job-item">
                <div>
                  <strong>{job.client}</strong> - {job.description}
                  <br />
                  <small>{getTimeRemaining(job.date)} • {getAreaFromLocation(job.location)}</small>
                </div>
                <div>
                  <button onClick={() => handleAccept(job.id)}>Accept</button>
                  <button onClick={() => handleReject(job.id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming Jobs */}
      <section className="section upcoming-jobs">
        <h2>Upcoming Jobs</h2>
        {upcomingJobs.length === 0 ? (
          <p>No upcoming jobs.</p>
        ) : (
          <ul>
            {upcomingJobs.map((job) => (
              <li key={job.id} className="job-item">
                <div>
                  <strong>{job.client}</strong> – {getTimeRemaining(job.date)}
                </div>
                <button onClick={() => setModalJob(job)}>View Details</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal for Job Details */}
      {modalJob && (
        <div className="modal-overlay" onClick={() => setModalJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Job Details</h3>
            <p><strong>Client:</strong> {modalJob.client}</p>
            <p><strong>Date:</strong> {new Date(modalJob.date).toLocaleString()}</p>
            <p><strong>Description:</strong> {modalJob.description}</p>
            <p><strong>Location:</strong> {modalJob.location}</p>
            <div>
              <button onClick={() => startJob(modalJob)}>Start Job</button>
              <button onClick={() => setModalJob(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Complete Job Feedback</h3>
            <textarea
              placeholder="Leave feedback..."
              value={completionFeedback}
              onChange={(e) => setCompletionFeedback(e.target.value)}
            />
            <div>
              <button
                disabled={!completionFeedback.trim()}
                onClick={() => {
                  console.log('Feedback submitted:', completionFeedback);
                  setShowCompletionModal(false);
                  setCompletionFeedback('');
                  setJobCompleted(true);
                  setCurrentBooking((prev) => ({ ...prev, status: 'Completed' }));
                }}
              >
                Submit
              </button>
              <button onClick={() => setShowCompletionModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
