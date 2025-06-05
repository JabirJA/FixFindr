const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all contractors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contractors');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET contractor by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM contractors WHERE contractor_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Contractor not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST a new contractor
router.post('/', async (req, res) => {
  const {
    user_id,
    service_type,
    city,
    state,
    age,
    nin,
    trade_certificate,
    government_id_photo,
    past_work_photos,
    languages,
    intro_text,
    experience,
    profile_photo,
    means_of_transport,
    bvn,
    residential_address,
    lga,
    phone_number
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO contractors (
        user_id, service_type, city, state, age, nin, trade_certificate,
        government_id_photo, past_work_photos, languages, intro_text,
        experience, profile_photo, means_of_transport, bvn,
        residential_address, lga, phone_number
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18
      ) RETURNING *`,
      [
        user_id, service_type, city, state, age, nin, trade_certificate,
        government_id_photo, past_work_photos, languages, intro_text,
        experience, profile_photo, means_of_transport, bvn,
        residential_address, lga, phone_number
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create contractor');
  }
});

// PUT update contractor
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const fields = [
    'service_type', 'city', 'state', 'age', 'nin', 'trade_certificate',
    'government_id_photo', 'past_work_photos', 'languages', 'intro_text',
    'experience', 'profile_photo', 'means_of_transport', 'bvn',
    'residential_address', 'lga', 'phone_number'
  ];

  const updates = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
  const values = fields.map(f => req.body[f]);
  values.unshift(id); // id as first argument

  try {
    const result = await pool.query(
      `UPDATE contractors SET ${updates} WHERE contractor_id = $1 RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Contractor not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update contractor');
  }
});

// DELETE contractor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM contractors WHERE contractor_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Contractor not found');
    }

    res.json({ message: 'Contractor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete contractor');
  }
});

module.exports = router;
