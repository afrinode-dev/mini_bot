const { deploySession } = require('../services/whatsappService');
const config = require('../config/config');

const deployBot = async (req, res) => {
  try {
    const { sessionId, phoneNumber } = req.body;
    
    if (!sessionId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Both sessionId and phoneNumber are required'
      });
    }

    const result = await deploySession(phoneNumber, sessionId);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Bot deployed successfully',
        downloadLink: result.downloadLink,
        phoneNumber
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deploy bot',
      error: error.message
    });
  }
};

module.exports = {
  deployBot
};
