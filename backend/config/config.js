module.exports = {
  whatsapp: {
    prefix: process.env.PREFIX || '.',
    ownerNumber: process.env.OWNER_NUM || '1234567890',
    mode: process.env.MODE || 'public',
    autoReadStatus: process.env.AUTO_READ_STATUS === 'true',
    autoRecording: process.env.AUTO_RECORDING === 'true'
  },
  mega: {
    email: process.env.MEGA_EMAIL,
    password: process.env.MEGA_PASSWORD
  },
  session: {
    id: process.env.SESSION_ID
  }
};
