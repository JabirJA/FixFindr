import React, { useState, useEffect } from 'react';
import './BookingManagement.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5050/bookings');
      const data = await response.json();
      setBookings(data.bookings || []);

      // If a booking is selected, update it with latest data
      if (selectedBooking) {
        const updated = data.bookings.find(
          (b) => b.booking_id === selectedBooking.booking_id
        );
        if (updated) setSelectedBooking(updated);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      (booking.user_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (booking.contractor_name?.toLowerCase() || '').includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5050/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (response.ok) {
        const updated = await response.json();
  
        setBookings(prev =>
          prev.map(b => (b.booking_id === id ? updated.booking : b))
        );
  
        setSelectedBooking(updated.booking); // <-- Use full updated booking
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const deleteBooking = async id => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const response = await fetch(`http://localhost:5050/bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(prev => prev.filter(b => b.booking_id !== id));
        setSelectedBooking(null);
      } else {
        console.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="booking-management">
      <h2>Booking Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by user or contractor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="status-select"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

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
          {filteredBookings.map(booking => {
            const date = new Date(booking.booking_date);
            return (
              <tr key={booking.booking_id}>
                <td>{booking.user_name || 'N/A'}</td>
                <td>
                
                    {booking.contractor_name || 'N/A'}
                
                </td>
                <td>{date.toLocaleDateString()}</td>
                <td>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{booking.status}</td>
                <td>
                  <button onClick={() => setSelectedBooking(booking)}>
                    View
                  </button>
                </td>
              </tr>
            );
          })}
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
    <div className="modal large">
      <h3>Booking Details</h3>

      <p><strong>User:</strong> {selectedBooking.user_name}</p>
      <p>
        <strong>Contractor:</strong>{' '}
        {/* <a
          href={`/contractor/${selectedBooking.contractor_id}`}
          target="_blank"
          rel="noopener noreferrer"
        > */}
          {selectedBooking.contractor_name}
        {/* </a> */}
      </p>
      <p><strong>Service:</strong> {selectedBooking.contractor_service}</p>
      <p><strong>Phone:</strong> {selectedBooking.contractor_phone}</p>
      <p><strong>Address:</strong> {selectedBooking.full_address}</p>
      <p><strong>Booking Type:</strong> {selectedBooking.booking_type}</p>
      <p><strong>Scheduled Slot:</strong> {selectedBooking.scheduled_slot || 'N/A'}</p>
      <p><strong>Amount:</strong> ₦{selectedBooking.total_amount}</p>
      <p><strong>Status:</strong> {selectedBooking.status}</p>
      <p><strong>Booking Date:</strong> {new Date(selectedBooking.booking_date).toLocaleString()}</p>
      <p><strong>User Location:</strong> Lat {selectedBooking.user_lat}, Lng {selectedBooking.user_lng}</p>

      {/* ✅ Only show when status is Cancelled */}
      {selectedBooking.status === 'Cancelled' && (
        <>
          {selectedBooking.cancelled_at && (
            <p><strong>Cancelled At:</strong> {new Date(selectedBooking.cancelled_at).toLocaleString()}</p>
          )}
          {selectedBooking.cancelled_by && (
            <p><strong>Cancelled By:</strong> {selectedBooking.cancelled_by}</p>
          )}
          {selectedBooking.cancellation_reason && (
            <p><strong>Reason:</strong> {selectedBooking.cancellation_reason}</p>
          )}
        </>
      )}

      {/* ✅ Only show when status is Completed */}
      {selectedBooking.status === 'Completed' && (
        <>
          {selectedBooking.completed_at && (
            <p><strong>Completed At:</strong> {new Date(selectedBooking.completed_at).toLocaleString()}</p>
          )}
          {selectedBooking.rating_given && (
            <p><strong>Rating:</strong> ⭐ {selectedBooking.rating_given}/5</p>
          )}
          {selectedBooking.rating_note && (
            <p><strong>Review:</strong> {selectedBooking.rating_note}</p>
          )}
        </>
      )}

      {/* Always show */}
      {selectedBooking.service_state && (
        <p><strong>Service State:</strong> {selectedBooking.service_state}</p>
      )}
      {selectedBooking.service_area && (
        <p><strong>Service Area:</strong> {selectedBooking.service_area}</p>
      )}
      {selectedBooking.street_address && (
        <p><strong>Street Address:</strong> {selectedBooking.street_address}</p>
      )}

      <div className="modal-actions">
        {/* Cancel button (only if not already Cancelled/Refunded) */}
        {selectedBooking.status !== 'Cancelled' && selectedBooking.status !== 'Refunded' && (
          <button onClick={() => updateStatus(selectedBooking.booking_id, 'Cancelled')}>
            Cancel Booking
          </button>
        )}

        {/* Refund button (only if already Cancelled) */}
        {selectedBooking.status === 'Cancelled' && (
          <button
            onClick={() => updateStatus(selectedBooking.booking_id, 'Refunded')}
            style={{ backgroundColor: '#4caf50', color: 'white' }}
          >
            Issue Refund
          </button>
        )}

        <button onClick={() => deleteBooking(selectedBooking.booking_id)}>Delete Booking</button>
        <button onClick={() => setSelectedBooking(null)}>Close</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default BookingManagement;
