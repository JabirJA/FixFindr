// routes/reviews.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // or adjust path if needed

router.get('/:contractor_id', async (req, res) => {
  const { contractor_id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        u.first_name || ' ' || LEFT(u.last_name, 1) AS customer,
        b.rating_given AS rating,
        b.rating_note AS comment
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      WHERE b.contractor_id = $1 AND b.rating_given IS NOT NULL
      ORDER BY b.booking_date DESC
    `, [contractor_id]);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching contractor reviews:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
