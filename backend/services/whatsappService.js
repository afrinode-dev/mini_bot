const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');
const { v4: uuidv4 } = require('uuid');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const P = require('pino');
const config = require('../config/config');
const { storage } = require('./megaService');
const archiver = require('archiver');

let whatsappClient = null;
let qrCodeData = null;
let sessionId = null;
let adminNumber = null;

const initializeWhatsApp = () => {
  console.log('WhatsApp service initialized');
};

const startNewSession = async (adminPhoneNumber) => {
  adminNumber = adminPhoneNumber;
  sessionId = uuidv4();
  
  const authDir = path.join(__dirname, '..', 'auth_info_baileys');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir);
  }
  
  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();
  
  whatsappClient = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: Browsers.macOS('Firefox'),
    syncFullHistory: true,
    auth: state,
    version,
  });

  whatsappClient.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      qrCodeData = qr;
      qrcode.generate(qr, { small: true });
    }
    
    if (connection === 'open') {
      console.log('WhatsApp connected!');
      sendWelcomeMessage();
      whatsappClient.ev.on('creds.update', saveCreds);
    }
    
    if (connection === 'close') {
      handleDisconnect(lastDisconnect, adminPhoneNumber);
    }
  });

  setupEventHandlers();

  return { sessionId, qrCodeData };
};

const sendWelcomeMessage = () => {
  whatsappClient.sendMessage(
    `${adminNumber}@s.whatsapp.net`, 
    { text: `Your session ID is: ${sessionId}` }
  );
  
  whatsappClient.sendMessage(
    `${adminNumber}@s.whatsapp.net`,
    {
      image: { 
        url: 'https://github.com/Mahii-Botz/Mahii-md-LOGO/blob/main/ChatGPT%20Image%20Apr%2021,%202025,%2005_32_50%20PM.png?raw=true'
      },
      caption: 'WhatsApp Bot connected successfully ✅'
    }
  );
};

const handleDisconnect = (lastDisconnect, adminPhoneNumber) => {
  const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
  if (shouldReconnect) {
    console.log('Reconnecting...');
    startNewSession(adminPhoneNumber);
  }
};

const setupEventHandlers = () => {
  // Auto status seen and auto react
  whatsappClient.ev.on('messages.upsert', handleMessagesUpsert);
  
  // Anti-delete feature
  whatsappClient.ev.on('messages.delete', handleMessageDelete);
};

const handleMessagesUpsert = async ({ messages }) => {
  for (const message of messages) {
    await whatsappClient.readMessages([message.key]);
    
    await whatsappClient.sendMessage(message.key.remoteJid, {
      react: {
        text: '👍',
        key: message.key
      }
    });
    
    if (message.key.remoteJid === 'status@broadcast' && config.whatsapp.autoReadStatus) {
      await handleStatusUpdate(message);
    }
  }
};

const handleStatusUpdate = async (message) => {
  try {
    const mnyako = await jidNormalizedUser(whatsappClient.user.id);
    await whatsappClient.sendMessage(
      message.key.remoteJid,
      {
        react: { 
          text: '💚', 
          key: message.key 
        }
      },
      { 
        statusJidList: [message.key.participant, mnyako] 
      }
    );
  } catch (err) {
    console.error('Status reaction error:', err);
  }
};

const handleMessageDelete = async (item) => {
  try {
    const message = item.messages[0];
    if (!message.message || message.key.fromMe) return;

    const from = message.key.remoteJid;
    const sender = message.key.participant || message.key.remoteJid;
    const contentType = getContentType(message.message);
    const deletedMsg = message.message[contentType];

    let text = '';
    if (contentType === 'conversation') {
      text = deletedMsg;
    } else if (contentType === 'extendedTextMessage') {
      text = deletedMsg.text || deletedMsg;
    } else {
      return;
    }

    await whatsappClient.sendMessage(from, {
      text: `🛡️ *Anti-Delete*\n👤 *User:* @${sender.split('@')[0]}\n💬 *Deleted Message:* ${text}`,
      mentions: [sender]
    });
  } catch (err) {
    console.error('Anti-delete error:', err);
  }
};

const deploySession = async (targetPhoneNumber, sessionId) => {
  try {
    const sessionPath = path.join(__dirname, '..', 'auth_info_baileys');
    const zipPath = path.join(__dirname, '..', 'temp', `${sessionId}.zip`);
    
    await zipDirectory(sessionPath, zipPath);
    const file = await storage.upload(zipPath);
    const link = await storage.getLink(file);
    fs.unlinkSync(zipPath);
    
    return { 
      success: true, 
      message: 'Bot deployed successfully',
      downloadLink: link
    };
  } catch (error) {
    console.error('Deployment error:', error);
    return { success: false, message: 'Deployment failed' };
  }
};

const zipDirectory = (source, out) => {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};

module.exports = {
  initializeWhatsApp,
  startNewSession,
  deploySession,
  whatsappClient
};
