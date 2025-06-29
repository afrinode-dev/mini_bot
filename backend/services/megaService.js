const mega = require('mega');
const config = require('../config/config');

let storage;

const initializeMega = async () => {
  try {
    if (!config.mega.email || !config.mega.password) {
      console.warn('MEGA credentials not configured. Cloud storage will be disabled.');
      return;
    }

    storage = mega({ 
      email: config.mega.email, 
      password: config.mega.password 
    });
    
    await storage.login();
    console.log('Connected to MEGA storage ✅');
  } catch (error) {
    console.error('MEGA login failed:', error);
    throw new Error('Failed to initialize MEGA storage');
  }
};

const saveSessionToCloud = async (sessionPath, filename) => {
  if (!storage) {
    throw new Error('MEGA storage not initialized');
  }

  try {
    const file = await storage.upload(sessionPath);
    const link = await storage.getLink(file);
    return link;
  } catch (error) {
    console.error('Failed to upload session to MEGA:', error);
    throw new Error('Failed to upload session to cloud storage');
  }
};

module.exports = {
  initializeMega,
  saveSessionToCloud,
  storage
};
