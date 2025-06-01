import React, { useState } from 'react';
import './Messages.css';

const messageData = [
  {
    id: 'MSG-001',
    sender: 'John Doe',
    date: '2025-03-01',
    content: 'Hi there, just confirming the job completion.',
  },
  {
    id: 'MSG-002',
    sender: 'Maryam Ali',
    date: '2025-03-10',
    content: 'Thanks again for your help. Let’s work again soon!',
  },
  {
    id: 'MSG-003',
    sender: 'Green Logistics Ltd',
    date: '2025-04-02',
    content: 'We’d like to schedule another delivery this month.',
  },
];

function Messages() {
  const [filter, setFilter] = useState('');

  const filteredMessages = messageData.filter((msg) =>
    msg.sender.toLowerCase().includes(filter.toLowerCase()) ||
    msg.content.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="messages-container">
      <h2>Messages</h2>
      <p>Read and manage your client conversations.</p>

      <input
        type="text"
        className="message-filter-input"
        placeholder="Search by sender or message..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="message-list">
        {filteredMessages.map((msg) => (
          <div className="message-card" key={msg.id}>
            <div className="message-header">
              <span className="sender">{msg.sender}</span>
              <span className="date">{new Date(msg.date).toLocaleDateString()}</span>
            </div>
            <div className="message-content">
              {msg.content.length > 80
                ? msg.content.slice(0, 77) + '...'
                : msg.content}
            </div>
          </div>
        ))}
        {filteredMessages.length === 0 && (
          <p className="no-messages">No messages found.</p>
        )}
      </div>
    </div>
  );
}

export default Messages;
