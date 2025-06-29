require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { File } = require('megajs');

// Initialize services
const { initializeWhatsApp } = require('./services/whatsappService');
const { initializeMega } = require('./services/megaService');

// Routes
const sessionRoutes = require('./routes/sessionRoutes');
const deployRoutes = require('./routes/deployRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Check for existing session
const authDir = path.join(__dirname, 'auth_info_baileys');
if (!fs.existsSync(path.join(authDir, 'creds.json'))) {
  if (process.env.SESSION_ID) {
    console.log('Downloading session from MEGA...');
    const filer = File.fromURL(`https://mega.nz/file/${process.env.SESSION_ID}`);
    filer.download((err, data) => {
      if (err) {
        console.error('Failed to download session:', err);
      } else {
        if (!fs.existsSync(authDir)) {
          fs.mkdirSync(authDir);
        }
        fs.writeFile(path.join(authDir, 'creds.json'), data, (err) => {
          if (err) {
            console.error('Failed to save session:', err);
          } else {
            console.log('Session downloaded successfully ✅');
          }
        });
      }
    });
  } else {
    console.log('No existing session found. New sessions will be created.');
  }
}

// Initialize services
initializeMega();
initializeWhatsApp();

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/deploy', deployRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'running',
    message: 'WhatsApp Bot Deployment System is operational ✅',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
