const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET contractor dashboard info by profileToken
router.get('/dashboard/:profileToken', async (req, res) => {
    const { profileToken } = req.params;
  
    try {
      const query = `
        SELECT 
          c.contractor_id,
          c.service_type,
          c.city,
          c.state,
          c.age,
          c.nin,
          c.trade_certificate,
          c.government_id_photo,
          c.past_work_photos,
          c.languages,
          c.intro_text,
          c.experience,
          c.profile_photo,
          c.availability,
          c.means_of_transport,
          c.bvn,
          c.residential_address,
          c.lga,
          c.phone_number,
          c.star_rating,
          c.verified,
          c.created_at,
          c.updated_at,
          u.first_name,
          u.last_name,
          u.email,
          u.profile_token
        FROM users u
        INNER JOIN contractors c ON u.user_id = c.user_id
        WHERE u.profile_token = $1 AND u.role = 'contractor'
        LIMIT 1;
      `;
  
      const result = await pool.query(query, [profileToken]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Contractor not found' });
      }
  
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching contractor dashboard info:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

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
  
    const updates = [];
    const values = [id]; // first param is the contractor_id
  
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        values.push(req.body[field]);
        updates.push(`${field} = $${values.length}`);
      }
    });
  
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }
  
    const query = `
      UPDATE contractors
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE contractor_id = $1
      RETURNING *;
    `;
  
    try {
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Contractor not found' });
      }
  
      res.json({ message: 'Contractor updated successfully', contractor: result.rows[0] });
    } catch (err) {
      console.error('Error updating contractor:', err);
      res.status(500).json({ message: 'Failed to update contractor' });
    }
  });
  module.exports = router; 