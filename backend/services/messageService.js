const { whatsappClient } = require('./whatsappService');
const config = require('../config/config');

const sendMessage = async (phoneNumber, message) => {
  try {
    if (!whatsappClient) {
      throw new Error('WhatsApp client not initialized');
    }

    await whatsappClient.sendMessage(
      `${phoneNumber}@s.whatsapp.net`,
      { text: message }
    );
    
    return { success: true, message: 'Message sent successfully' };
  } catch (error) {
    console.error('Message sending error:', error);
    throw new Error('Failed to send message');
  }
};

const sendImageWithCaption = async (phoneNumber, imageUrl, caption) => {
  try {
    if (!whatsappClient) {
      throw new Error('WhatsApp client not initialized');
    }

    await whatsappClient.sendMessage(
      `${phoneNumber}@s.whatsapp.net`,
      {
        image: { url: imageUrl },
        caption: caption
      }
    );
    
    return { success: true, message: 'Image with caption sent successfully' };
  } catch (error) {
    console.error('Image sending error:', error);
    throw new Error('Failed to send image with caption');
  }
};

module.exports = {
  sendMessage,
  sendImageWithCaption
};
