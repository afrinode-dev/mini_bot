const { startNewSession } = require('../services/whatsappService');
const config = require('../config/config');

const createSession = async (req, res) => {
  try {
    const { adminPhoneNumber } = req.body;
    
    if (!adminPhoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Admin phone number is required'
      });
    }

    const { sessionId, qrCodeData } = await startNewSession(adminPhoneNumber);
    
    res.status(201).json({
      success: true,
      sessionId,
      qrCodeData,
      message: 'Session created successfully. Scan the QR code to proceed.'
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
      error: error.message
    });
  }
};

const getSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // In a real implementation, you would check the actual session status
    res.status(200).json({
      success: true,
      sessionId,
      status: 'active',
      lastActive: new Date().toISOString()
    });
  } catch (error) {
    console.error('Session status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get session status',
      error: error.message
    });
  }
};

module.exports = {
  createSession,
  getSessionStatus
};
