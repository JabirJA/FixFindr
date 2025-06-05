require('dotenv').config(); // ensure env vars are loaded

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const contractorRoutes = require('./routes/contractors');
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());           // CORS middleware before any routes
app.use(express.json());   // JSON body parser

app.get('/', (req, res) => {
  res.send('Fix-Finder backend is up and running');
});

app.use('/auth', authRoutes);
app.use('/contractors', contractorRoutes);

// Optional: 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Optional: global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
