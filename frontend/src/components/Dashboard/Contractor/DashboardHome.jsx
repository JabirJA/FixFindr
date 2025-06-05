import React, { useState } from 'react';
import './DashboardHome.css';
import logo2 from '../../../assets/logo2.png';

const DashboardHome = () => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionFeedback, setCompletionFeedback] = useState('');
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
      mapEmbedUrl:
        'https://maps.google.com/maps?q=abuja&t=&z=13&ie=UTF8&iwloc=&output=embed',
    },
    startTime: '2025-05-20 10:00 AM',
  });

  const [jobCompleted, setJobCompleted] = useState(false);
  const [modalJob, setModalJob] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { from: 'Client', text: 'Please don’t be late.' },
    { from: 'You', text: 'Already en route.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Accept pending job -> move to upcoming
  const handleAccept = (jobId) => {
    const jobToAccept = pendingJobs.find((job) => job.id === jobId);
    if (jobToAccept) {
      setUpcomingJobs((prev) => [...prev, jobToAccept]);
      setPendingJobs((prev) => prev.filter((job) => job.id !== jobId));
    }
  };

  // Reject pending job -> remove
  const handleReject = (jobId) => {
    setPendingJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  // Start an upcoming job as current job
  const startJob = (job) => {
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
        mapEmbedUrl:
          'https://maps.google.com/maps?q=' +
          encodeURIComponent(job.location) +
          '&t=&z=13&ie=UTF8&iwloc=&output=embed',
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
    // Split by comma and trim spaces
    const parts = location.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : location;
  };
  
  const getTimeRemaining = (dateStr) => {
    const jobDate = new Date(dateStr);
    const now = new Date();
    const diffMs = jobDate - now;

    if (diffMs <= 0) return 'Starting soon';
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const sendMessage = () => {
    if (chatInput.trim() === '') return;
    setChatMessages((prev) => [...prev, { from: 'You', text: chatInput }]);
    setChatInput('');
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
            <div
              className="chat-box"
              style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', padding: '8px' }}
            >
              {chatMessages.map((msg, idx) => (
                <p key={idx}><strong>{msg.from}:</strong> {msg.text}</p>
              ))}
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex' }}>
              <input
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                style={{ flexGrow: 1, marginRight: '0.5rem' }}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
            <button
              onClick={() => setShowCompletionModal(true)}
              className="complete-btn"
              style={{ marginTop: '1rem' }}
            >
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
            <small>
              {getTimeRemaining(job.date)} • {getAreaFromLocation(job.location)}
            </small>
          </div>
          <div style={{ marginTop: '5px' }}>
            <button onClick={() => handleAccept(job.id)} style={{ marginRight: '0.5rem' }}>
              Accept
            </button>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Job Details</h3>
            <p><strong>Client:</strong> {modalJob.client}</p>
            <p><strong>Date:</strong> {new Date(modalJob.date).toLocaleString()}</p>
            <p><strong>Description:</strong> {modalJob.description}</p>
            <p><strong>Location:</strong> {modalJob.location}</p>

            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => alert('Open chat with client')}
                style={{ marginRight: '0.5rem' }}
              >
                Chat
              </button>
              <button
                onClick={() => startJob(modalJob)}
                style={{ marginRight: '0.5rem' }}
              >
                Start Job
              </button>
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
              placeholder="Leave feedback or notes about the job..."
              value={completionFeedback}
              onChange={(e) => setCompletionFeedback(e.target.value)}
              rows={5}
              style={{ width: '100%', marginBottom: '1rem' }}
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
