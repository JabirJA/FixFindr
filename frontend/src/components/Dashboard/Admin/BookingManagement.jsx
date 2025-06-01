import React, { useState, useEffect } from 'react';
import './BookingManagement.css';

const mockBookings = [
  {
    id: 1,
    user: 'Alice Johnson',
    contractor: 'John Doe',
    date: '2025-05-20',
    time: '2:00 PM',
    status: 'In Progress',
  },
  {
    id: 2,
    user: 'Bob Smith',
    contractor: 'Mary Smith',
    date: '2025-05-21',
    time: '11:00 AM',
    status: 'Completed',
  },
  {
    id: 3,
    user: 'Charlie Brown',
    contractor: 'Ahmed Khan',
    date: '2025-05-22',
    time: '4:30 PM',
    status: 'Pending',
  },
  {
    id: 4,
    user: 'Charlie Puth',
    contractor: 'Godwin',
    date: '2025-05-22',
    time: '4:40 PM',
    status: 'Cancelled',
  },
];

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    setBookings(mockBookings);
  }, []);

  const filteredBookings = bookings.filter(
    booking =>
      booking.user.toLowerCase().includes(search.toLowerCase()) ||
      booking.contractor.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id, newStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
    );
    setSelectedBooking(null); // close modal after action
  };

  const deleteBooking = id => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(prev => prev.filter(b => b.id !== id));
      setSelectedBooking(null); // close modal after delete
    }
  };

  return (
    <div className="booking-management">
      <h2>Booking Management</h2>

      <input
        type="text"
        placeholder="Search by user or contractor..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />

      <table className="booking-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Contractor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.user}</td>
              <td>{booking.contractor}</td>
              <td>{booking.date}</td>
              <td>{booking.time}</td>
              <td>{booking.status}</td>
              <td>
                <button onClick={() => setSelectedBooking(booking)}>
                  View
                </button>
              </td>
            </tr>
          ))}
          {filteredBookings.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Booking Details</h3>
            <p><strong>User:</strong> {selectedBooking.user}</p>
            <p><strong>Contractor:</strong> {selectedBooking.contractor}</p>
            <p><strong>Date:</strong> {selectedBooking.date}</p>
            <p><strong>Time:</strong> {selectedBooking.time}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>

           
              <button onClick={() => setSelectedBooking(null)}>Close</button>
            </div>
          </div>
      )}
    </div>
  );
};

export default BookingManagement;
