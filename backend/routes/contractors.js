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

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Helper to clean up uploaded files
const cleanupFiles = (files) => {
  if (!files) return;
  Object.keys(files).forEach(field => {
    files[field].forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  });
};
router.post('/submit-kyc', upload.fields([
  { name: 'id', maxCount: 1 },
  { name: 'tradeCertificate', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'vehicleProof', maxCount: 1 },
  { name: 'reference_files', maxCount: 1 },
  { name: 'workSample_0' },
  { name: 'workSample_1' },
  { name: 'workSample_2' },
  { name: 'workSample_3' },
  { name: 'workSample_4' }
]), async (req, res) => {
  try {
    const {
      experience, bvn, address,
      state, lga, transport, user_id, bio, area
    } = req.body;

    let languages = [];
    if (req.body.languages) {
      try {
        languages = JSON.parse(req.body.languages);
      } catch {
        languages = [];
      }
    }

    if (!user_id) {
      cleanupFiles(req.files);
      return res.status(400).json({ error: 'User ID is required' });
    }

    const contractorResult = await pool.query(
      'SELECT contractor_id FROM contractors WHERE user_id = $1 LIMIT 1',
      [user_id]
    );

    const contractorId = contractorResult.rows[0]?.contractor_id;

    const buildPath = (field) => req.files[field] ? req.files[field][0].path : null;
    const government_id_photo = buildPath('id');
    const trade_certificate = buildPath('tradeCertificate');
    const profile_photo = buildPath('photo');
    const vehicle_proof = buildPath('vehicleProof');
    const reference_files = buildPath('reference_files');
    const past_work_photos = Object.keys(req.files || {})
      .filter(k => k.startsWith('workSample_'))
      .map(k => req.files[k][0].path);  // JS array

    if (contractorId) {
      const result = await pool.query(
        `UPDATE contractors SET
          experience = $1, bvn = $2, residential_address = $3,
          state = $4, lga = $5, area = $6, bio = $7,
          languages = $8, means_of_transport = $9,
          government_id_photo = $10, trade_certificate = $11, profile_photo = $12,
          vehicle_proof = $13, reference_files = $14, past_work_photos = $15,
          applied = true, updated_at = CURRENT_TIMESTAMP
        WHERE contractor_id = $16
        RETURNING *`,
        [
          experience, bvn, address,
          state, lga, area, bio,
          languages, transport,
          government_id_photo, trade_certificate, profile_photo,
          vehicle_proof, reference_files, past_work_photos,
          contractorId
        ]
      );

      console.log('BODY:', req.body);
      console.log('FILES:', req.files);

      res.json({ message: 'Contractor profile updated', contractor: result.rows[0] });
    } else {
      const result = await pool.query(
        `INSERT INTO contractors (
          user_id, experience, bvn, residential_address,
          state, lga, area, bio, languages, means_of_transport,
          government_id_photo, trade_certificate, profile_photo,
          vehicle_proof, reference_files, past_work_photos, applied
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8, $9, $10,
          $11, $12, $13,
          $14, $15, $16, true
        )
        RETURNING *`,
        [
          user_id, experience, bvn, address,
          state, lga, area, bio, languages, transport,
          government_id_photo, trade_certificate, profile_photo,
          vehicle_proof, reference_files, past_work_photos
        ]
      );

      res.status(201).json({ message: 'Contractor profile created', contractor: result.rows[0] });
    }

  } catch (err) {
    console.error('Error processing KYC submission:', err);
    cleanupFiles(req.files);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// GET contractor dashboard by profileToken
router.get('/dashboard/:profileToken', async (req, res) => {
  try {
    const { profileToken } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.first_name, u.last_name, u.email, u.profile_token
       FROM contractors c
       JOIN users u ON c.user_id = u.user_id
       WHERE u.profile_token = $1 AND u.role = 'contractor'`,
      [profileToken]
    );

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
    const result = await pool.query(
      `SELECT c.*, u.first_name, u.last_name
       FROM contractors c
       JOIN users u ON c.user_id = u.user_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching contractors:', err);
    res.status(500).send('Server error');
  }
});

// GET contractor by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid contractor ID' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM contractors WHERE contractor_id = $1',
      [id]
    );

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

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid contractor ID' });
  }

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
// PUT /api/contractors/:contractorId/verify
router.put('/:contractorId/verify', async (req, res) => {
    const { contractorId } = req.params;
    const { verified } = req.body; // expects true/false
  
    try {
      const result = await pool.query(
        'UPDATE contractors SET verified = $1 WHERE contractor_id = $2 RETURNING *',
        [verified, contractorId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Contractor not found' });
      }
  
      res.json({ message: `Contractor has been ${verified ? 'verified' : 'unverified'}`, contractor: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  // DELETE //contractors/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid contractor ID' });
    }
  
    try {
      // Optionally: Fetch contractor info to delete associated files later
      const contractorResult = await pool.query(
        'SELECT * FROM contractors WHERE contractor_id = $1',
        [id]
      );
  
      if (contractorResult.rows.length === 0) {
        return res.status(404).json({ error: 'Contractor not found' });
      }
  
      const contractor = contractorResult.rows[0];
  
      // Delete contractor record
      await pool.query(
        'DELETE FROM contractors WHERE contractor_id = $1',
        [id]
      );
  
      // Cleanup files (if you want to remove uploaded files too)
      const filePaths = [
        contractor.government_id_photo,
        contractor.trade_certificate,
        contractor.profile_photo,
        contractor.vehicle_proof,
        contractor.reference_files,
        ...(contractor.past_work_photos ? contractor.past_work_photos.split(',') : [])
      ];
  
      filePaths.forEach(filePath => {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Failed to delete file: ${filePath}`, err);
            } else {
              console.log(`Deleted file: ${filePath}`);
            }
          });
        }
      });
  
      res.json({ message: 'Contractor removed successfully' });
  
    } catch (err) {
      console.error('Error deleting contractor:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
module.exports = router;
