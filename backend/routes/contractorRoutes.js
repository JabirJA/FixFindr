const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const usersDB = [];

router.post('/register', async (req, res) => {
  // the same registration logic, but route is /register (full path /api/contractors/register)
});

module.exports = router;
