const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');  // <--for token

// REGISTER
router.post('/register', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role, // 'user' or 'contractor'
    gender,
    date_of_birth,
    address,
    serviceType,
    phone,
    nin,
    age,
    city,
    state,
    tradeCertificate,
    govIdPhoto,
    pastWorkPhotos,
    languages,
    starRating,
    introText,
    experience,
    profilePhoto,
    availability,
    meansOfTransport,
    bvn,
    residentialAddress,
    lga,
    verified
  } = req.body;

  try {
    // 1. Check if email exists
    const emailCheck = await pool.query(`SELECT 1 FROM users WHERE email = $1`, [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2.5 Generate unique profile token
    const profileToken = nanoid(8);

    // 3. Insert into users table with profile_token
    const insertUserQuery = `
      INSERT INTO users (first_name, last_name, email, password_hash, role, profile_token, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING user_id
    `;
    const userResult = await pool.query(insertUserQuery, [
      firstName,
      lastName,
      email,
      hashedPassword,
      role,
      profileToken
    ]);
    const userId = userResult.rows[0].user_id;

    // 4. Role-specific insertion
    if (role === 'user') {
      const insertProfileQuery = `
        INSERT INTO user_profiles (user_id, gender, date_of_birth, address, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `;
      await pool.query(insertProfileQuery, [
        userId,
        gender || null,
        date_of_birth || null,
        address || null
      ]);

      return res.status(201).json({ 
        message: 'User registered successfully', 
        userId, 
        profileToken 
      });

    } else if (role === 'contractor') {
      const insertContractorQuery = `
        INSERT INTO contractors (
          user_id, service_type, city, state, age, nin, phone_number, trade_certificate,
          government_id_photo, past_work_photos, languages, star_rating, intro_text,
          experience, profile_photo, availability, means_of_transport, bvn,
          residential_address, lga, verified, created_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18,
          $19, $20, $21, NOW(), NOW()
        )
        RETURNING contractor_id
      `;
    
      const contractorResult = await pool.query(insertContractorQuery, [
        userId,
        serviceType || null,
        city || null,
        state || null,
        age || null,
        nin || null,
        phone || null,
        tradeCertificate || null,
        govIdPhoto || null,
        pastWorkPhotos || null,
        languages || null,
        starRating || null,
        introText || null,
        experience || null,
        profilePhoto || null,
        availability || null,
        meansOfTransport || null,
        bvn || null,
        residentialAddress || null,
        lga || null,
        verified || false
      ]);
    
      const contractorId = contractorResult.rows[0].contractor_id;
    
      return res.status(201).json({
        message: 'Contractor registered successfully',
        userId,
        contractorId,
        profileToken
      });

    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// LOGIN route stays unchanged

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userResult = await pool.query(
        'SELECT user_id, email, password_hash, role, profile_token FROM users WHERE email = $1',
        [email]
      );
      

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({
        message: 'Login successful',
        userId: user.user_id,
        role: user.role,
        profileToken: user.profile_token  // send it here
      });
      

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again later.' });
  }
});

module.exports = router;
