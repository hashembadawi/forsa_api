const whatsappService = require('../utils/whatsappService');

class WhatsAppInitializer {
  static async initialize() {
    try {
      console.log('Initializing WhatsApp service...');
      await whatsappService.initialize();
      console.log('WhatsApp service initialization started. Check console for QR code if needed.');
    } catch (error) {
      console.error('Failed to initialize WhatsApp service:', error);
    }
  }

  static getService() {
    return whatsappService;
  }
}

module.exports = WhatsAppInitializer;
