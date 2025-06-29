const express = require('express');
const router = express.Router();
const deployController = require('../controllers/deployController');

// Deploy a WhatsApp bot
router.post('/', deployController.deployBot);

module.exports = router;
