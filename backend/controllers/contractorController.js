const express = require('express');
const router = express.Router();
const contractorController = require('../controllers/contractorController');

router.post('/register', contractorController.registerContractor);

module.exports = router;
