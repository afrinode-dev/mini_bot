const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Create a new WhatsApp session
router.post('/', sessionController.createSession);

// Get session status
router.get('/:sessionId', sessionController.getSessionStatus);

module.exports = router;
