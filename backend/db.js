require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,       // e.g., 'postgres'
  host: process.env.PG_HOST,       // e.g., 'localhost'
  database: process.env.PG_DATABASE, // your DB name
  password: process.env.PG_PASSWORD, // your DB password
  port: process.env.PG_PORT || 5432, // default postgres port
});

module.exports = pool;
