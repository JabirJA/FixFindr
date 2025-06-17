const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const contractorId = req.body.user_id || 'general';
    const uploadPath = `uploads/contractor_${contractorId}/`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// POST: submit KYC
router.post('/submit-kyc', upload.fields([
  { name: 'id', maxCount: 1 },
  { name: 'tradeCertificate', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'vehicleProof', maxCount: 1 },
  { name: 'references', maxCount: 1 },
  { name: 'workSample_0' },
  { name: 'workSample_1' },
  { name: 'workSample_2' },
  { name: 'workSample_3' },
  { name: 'workSample_4' }
]), async (req, res) => {
  const cleanupFiles = () => {
    Object.values(req.files || {}).flat().forEach(file => {
      fs.unlink(file.path, err => {
        if (err) console.error(`Failed to delete ${file.path}`);
      });
    });
  };

  try {
    const {
      phone, email, experience, nin, bvn, address,
      state, lga, transport, user_id
    } = req.body;

    if (!user_id) {
      cleanupFiles();
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find contractor by user_id
    const contractorResult = await pool.query(
      'SELECT contractor_id FROM contractors WHERE user_id = $1 LIMIT 1',
      [user_id]
    );

    let contractorId = contractorResult.rows[0]?.contractor_id;

    const buildPath = (field) => req.files[field] ? req.files[field][0].path : null;
    const government_id_photo = buildPath('id');
    const trade_certificate = buildPath('tradeCertificate');
    const profile_photo = buildPath('photo');
    const vehicle_proof = buildPath('vehicleProof');
    const references = buildPath('references');
    const past_work_photos = Object.keys(req.files || {})
      .filter(k => k.startsWith('workSample_'))
      .map(k => req.files[k][0].path)
      .join(',');

    if (contractorId) {
      // Update contractor
      const result = await pool.query(
        `UPDATE contractors SET
          nin = $1,
          bvn = $2,
          residential_address = $3,
          state = $4,
          lga = $5,
          means_of_transport = $6,
          government_id_photo = $7,
          trade_certificate = $8,
          profile_photo = $9,
          vehicle_proof = $10,
          references = $11,
          past_work_photos = $12,
          updated_at = CURRENT_TIMESTAMP
        WHERE contractor_id = $13
        RETURNING *`,
        [
          nin, bvn, address, state, lga, transport,
          government_id_photo, trade_certificate, profile_photo,
          vehicle_proof, references, past_work_photos,
          contractorId
        ]
      );
      res.json({ message: 'Contractor profile updated', contractor: result.rows[0] });
    } else {
      // Insert contractor
      const result = await pool.query(
        `INSERT INTO contractors (
          user_id, phone_number, email, experience, nin, bvn,
          residential_address, state, lga, means_of_transport,
          government_id_photo, trade_certificate, profile_photo,
          vehicle_proof, references, past_work_photos
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13,
          $14, $15, $16
        ) RETURNING *`,
        [
          user_id, phone, email, experience, nin, bvn,
          address, state, lga, transport,
          government_id_photo, trade_certificate, profile_photo,
          vehicle_proof, references, past_work_photos
        ]
      );
      res.status(201).json({ message: 'Contractor profile created', contractor: result.rows[0] });
    }

  } catch (err) {
    console.error('Error processing KYC submission:', err);
    cleanupFiles();
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET contractor dashboard by profileToken
router.get('/dashboard/:profileToken', async (req, res) => {
  try {
    const { profileToken } = req.params;

    const query = `
      SELECT 
        c.*,
        u.first_name,
        u.last_name,
        u.email,
        u.profile_token
      FROM contractors c
      JOIN users u ON c.user_id = u.user_id
      WHERE u.profile_token = $1 AND u.role = 'contractor'
      LIMIT 1;
    `;

    const result = await pool.query(query, [profileToken]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contractor not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching contractor dashboard info:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all contractors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.first_name, u.last_name
      FROM contractors c
      JOIN users u ON c.user_id = u.user_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching contractors:', err);
    res.status(500).send('Server error');
  }
});

// GET contractor by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid contractor ID' });

  try {
    const result = await pool.query('SELECT * FROM contractors WHERE contractor_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contractor not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching contractor:', err);
    res.status(500).send('Server error');
  }
});

// PUT update contractor
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) return res.status(400).json({ error: 'Invalid contractor ID' });

  const fields = [
    'service_type', 'city', 'state', 'age', 'nin', 'trade_certificate',
    'government_id_photo', 'past_work_photos', 'languages', 'intro_text',
    'experience', 'profile_photo', 'means_of_transport', 'bvn',
    'residential_address', 'lga', 'phone_number'
  ];

  const updates = [];
  const values = [id];

  fields.forEach(field => {
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
