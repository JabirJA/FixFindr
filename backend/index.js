const express = require('express');
const cors = require('cors');
const contractorRoutes = require('./routes/contractorRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/contractors', contractorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
