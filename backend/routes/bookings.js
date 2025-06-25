const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust path as needed
// CREATE new booking
router.post('/', async (req, res) => {
    const {
      user_id,
      contractor_id,
      booking_date,
      total_amount,
      booking_type,
      scheduled_slot,
      user_lat,
      user_lng,
      service_state,
      service_area,
      street_address,
      full_address,
      status
    } = req.body;
  
    if (!user_id || !contractor_id || !booking_date) {
      return res.status(400).json({ error: 'Missing required booking info' });
    }
  
    try {
      const result = await pool.query(
        `INSERT INTO bookings (
          user_id, contractor_id, booking_date, status, total_amount,
          booking_type, scheduled_slot, user_lat, user_lng,
          service_state, service_area, street_address, full_address,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12, $13,
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING *`,
        [
          user_id,
          contractor_id,
          booking_date,
          status || 'Pending',
          total_amount || 0,
          booking_type || null,
          scheduled_slot || null,
          user_lat || null,
          user_lng || null,
          service_state || null,
          service_area || null,
          street_address || null,
          full_address || null
        ]
      );
  
      res.status(201).json({ message: 'Booking created', booking: result.rows[0] });
    } catch (err) {
      console.error('Error creating booking:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
// GET all bookings for a user
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE user_id = $1 ORDER BY booking_date DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all bookings for a contractor
router.get('/contractor/:contractor_id', async (req, res) => {
  const { contractor_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE contractor_id = $1 ORDER BY booking_date DESC`,
      [contractor_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching contractor bookings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE booking status
router.put('/:booking_id/status', async (req, res) => {
  const { booking_id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await pool.query(
      `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE booking_id = $2 RETURNING *`,
      [status, booking_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Status updated', booking: result.rows[0] });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE (cancel) a booking
router.delete('/:booking_id', async (req, res) => {
  const { booking_id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM bookings WHERE booking_id = $1 RETURNING *`,
      [booking_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled', booking: result.rows[0] });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
// GET a single booking by ID
router.get('/:booking_id', async (req, res) => {
    const { booking_id } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT * FROM bookings WHERE booking_id = $1`,
        [booking_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      res.json({ booking: result.rows[0] });
    } catch (err) {
      console.error('Error fetching booking:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
module.exports = router;
