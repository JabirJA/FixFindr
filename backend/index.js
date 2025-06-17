require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const contractorRoutes = require('./routes/contractors');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Fix-Finder backend is up and running');
});

app.use('/auth', authRoutes);
app.use('/contractors', contractorRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
