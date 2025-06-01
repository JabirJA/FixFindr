import React, { useState } from 'react';
import './DashboardHome.css';
import logo2 from '../../../assets/logo2.png';



const DashboardHome = () => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionFeedback, setCompletionFeedback] = useState('');


  const [currentBooking, setCurrentBooking] = useState({
    id: 'abc123',
    contractorName: 'John Doe',
    serviceType: 'Mechanic',
    contractorPhone: '555-123-4567',
    price: 150,
    status: 'Ongoing',
    imageUrl: logo2,
    location: {
      address: '123 Main St, Abuja, Nigeria',
      mapEmbedUrl: 'https://maps.google.com/maps?q=abuja&t=&z=13&ie=UTF8&iwloc=&output=embed',
    },
    startTime: '2025-05-20 10:00 AM',
  });

  const [jobCompleted, setJobCompleted] = useState(false);

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

  const [modalJob, setModalJob] = useState(null);

  const getTimeRemaining = (dateStr) => {
    const jobDate = new Date(dateStr);
    const now = new Date();
    const diffMs = jobDate - now;

    if (diffMs <= 0) return 'Starting soon';
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `in ${diffMins} minutes`;
    if (diffHours < 24) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="dashboard-container-row">

      {/* Current Job */}
      <section className="section current-job">
        <h2>Current Job</h2>
        {!jobCompleted ? (
          <>
            <p><strong>Service:</strong> {currentBooking.serviceType}</p>
            <p><strong>Client:</strong> {currentBooking.contractorName}</p>
            <p><strong>Phone:</strong> {currentBooking.contractorPhone}</p>
            <p><strong>Start Time:</strong> {currentBooking.startTime}</p>
            <p><strong>Price:</strong> ₦{currentBooking.price}</p>
            <p><strong>Status:</strong> {currentBooking.status}</p>
          </>
        ) : (
          <p>No current job at the moment.</p>
        )}

        {!jobCompleted && (
          <div className="chat-section">
            <h3>Current Chat</h3>
            <div className="chat-box">
              <p><strong>Client:</strong> Please don’t be late.</p>
              <p><strong>You:</strong> Already en route.</p>
              <input placeholder="Type a message..." />
            </div>
            <button onClick={() => setShowCompletionModal(true)} className="complete-btn">
              Mark as Complete
            </button>
          </div>
        )}
      </section>

      {/* Location */}
      {!jobCompleted && (
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

      {/* Upcoming Jobs */}
      <section className="section upcoming-jobs">
        <h2>Upcoming Jobs</h2>
        {upcomingJobs.length === 0 ? (
          <p>No upcoming jobs.</p>
        ) : (
          <ul>
            {upcomingJobs.map(job => (
              <li key={job.id} className="job-item">
                <div>
                  <strong>{job.client}</strong> – {getTimeRemaining(job.date)}
                </div>
                <button onClick={() => setModalJob(job)} style={{ marginTop: '5px' }}>
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>


      {/* View Details Modal */}
      {modalJob && (
        <div className="modal-overlay" onClick={() => setModalJob(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Job Details</h3>
            <p><strong>Client:</strong> {modalJob.client}</p>
            <p><strong>Date:</strong> {new Date(modalJob.date).toLocaleString()}</p>
            <p><strong>Description:</strong> {modalJob.description}</p>
            <p><strong>Location:</strong> {modalJob.location}</p>

            <div style={{ marginTop: '1rem' }}>
              <button onClick={() => alert('Open chat with client')} style={{ marginRight: '0.5rem' }}>
                Chat
              </button>
              <button onClick={() => setModalJob(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Complete Job Feedback</h3>
            <textarea
              placeholder="Leave feedback or notes about the job..."
              value={completionFeedback}
              onChange={(e) => setCompletionFeedback(e.target.value)}
              rows={5}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <div>
              <button
                onClick={() => {
                  console.log('Feedback submitted:', completionFeedback);
                  setShowCompletionModal(false);
                  setCompletionFeedback('');
                  setJobCompleted(true);
                  setCurrentBooking(prev => ({ ...prev, status: 'Completed' }));
                }}
                style={{ marginRight: '0.5rem' }}
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
