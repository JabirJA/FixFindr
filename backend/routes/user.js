const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /user/profile/:profileToken
router.get('/dashboard/:profileToken', async (req, res) => {
  const { profileToken } = req.params;

  try {
    const client = await pool.connect();

    // Query user info joining users and user_profiles
    const userQuery = `
      SELECT u.first_name, u.last_name, u.email, u.role, u.profile_token,
             up.gender, up.date_of_birth, up.address, up.created_at as profile_created_at
      FROM users u
      LEFT JOIN user_profiles up ON u.user_id = up.user_id
      WHERE u.profile_token = $1
      LIMIT 1;
    `;

    const { rows } = await client.query(userQuery, [profileToken]);
    client.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (pick what you want to expose)
    const userData = rows[0];

    return res.json({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      role: userData.role,
      gender: userData.gender,
      date_of_birth: userData.date_of_birth,
      address: userData.address,
      profile_token: userData.profile_token,
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
// POST /user/dashboard/:profileToken
router.post('/dashboard/:profileToken', async (req, res) => {
    const { profileToken } = req.params;
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      address,
    } = req.body;
  
    if (!first_name || !last_name) {
      return res.status(400).json({ message: 'First name and last name are required.' });
    }
  
    try {
      const client = await pool.connect();
  
      // Start a transaction since we update multiple tables
      await client.query('BEGIN');
  
      // Update users table
      const updateUserQuery = `
        UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP
        WHERE profile_token = $3
        RETURNING user_id, first_name, last_name, email, role, profile_token;
      `;
  
      const userResult = await client.query(updateUserQuery, [first_name, last_name, profileToken]);
  
      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userId = userResult.rows[0].user_id;
  
      // Upsert into user_profiles
      const upsertProfileQuery = `
        INSERT INTO user_profiles (user_id, gender, date_of_birth, address, created_at, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id)
        DO UPDATE SET gender = EXCLUDED.gender,
                      date_of_birth = EXCLUDED.date_of_birth,
                      address = EXCLUDED.address,
                      updated_at = CURRENT_TIMESTAMP;
      `;
  
      await client.query(upsertProfileQuery, [userId, gender, date_of_birth, address]);
  
      await client.query('COMMIT');
      client.release();
  
      // Return updated user profile data
      return res.json({
        message: 'Profile updated successfully',
        user: {
          first_name: userResult.rows[0].first_name,
          last_name: userResult.rows[0].last_name,
          email: userResult.rows[0].email,
          role: userResult.rows[0].role,
          gender,
          date_of_birth,
          address,
          profile_token: userResult.rows[0].profile_token,
        },
      });
  
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
module.exports = router;
