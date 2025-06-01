import React, { useState, useEffect } from 'react';
import './Messages.css';

const mockSupportMessages = [
  {
    id: 1,
    senderName: 'Fatima Yusuf',
    senderRole: 'User',
    subject: 'Booking Issue',
    message: 'My contractor never showed up. I want a refund.',
    timestamp: '2025-05-21 10:15 AM',
    status: 'Open'
  },
  {
    id: 2,
    senderName: 'Ahmed Bello',
    senderRole: 'Contractor',
    subject: 'Verification Delay',
    message: 'I uploaded my license but haven’t been verified yet.',
    timestamp: '2025-05-21 09:50 AM',
    status: 'Open'
  }
];

const AdminMessages = () => {
  const [supportMessages, setSupportMessages] = useState([]);

  useEffect(() => {
    // Replace with real backend call later
    setSupportMessages(mockSupportMessages);
  }, []);

  return (
    <div className="messages-container">
      <h2>Support & Disputes Inbox</h2>
      {supportMessages.length === 0 ? (
        <p>No support requests at this time.</p>
      ) : (
        <ul className="message-list">
          {supportMessages.map(msg => (
            <li key={msg.id} className="message-item">
              <div className="message-header">
                <strong>{msg.senderName}</strong>
                <span className="role-badge">{msg.senderRole}</span>
                <span className={`status-badge ${msg.status.toLowerCase()}`}>{msg.status}</span>
              </div>
              <div className="message-subject"><strong>Subject:</strong> {msg.subject}</div>
              <p className="message-text">{msg.message}</p>
              <div className="message-footer">{msg.timestamp}</div>
              {/* Optional admin actions */}
              {/* <button className="reply-btn">Reply</button> */}
              {/* <button className="resolve-btn">Mark as Resolved</button> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminMessages;
