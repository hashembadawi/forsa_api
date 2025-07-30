const { 
  default: makeWASocket, 
  DisconnectReason, 
  useMultiFileAuthState,
  isJidBroadcast
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const path = require('path');

class WhatsAppService {
  constructor() {
    this.sock = null;
    this.isConnected = false;
    this.qrCodeGenerated = false;
  }

  async initialize() {
    try {
      // Use auth state from a folder
      const { state, saveCreds } = await useMultiFileAuthState(
        path.join(__dirname, '../../auth_info_baileys')
      );

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // We'll handle QR manually
        defaultQueryTimeoutMs: 60000,
      });

      // Handle connection updates
      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && !this.qrCodeGenerated) {
          console.log('QR Code for WhatsApp Web:');
          qrcode.generate(qr, { small: true });
          this.qrCodeGenerated = true;
          console.log('Please scan this QR code with your WhatsApp mobile app.');
        }

        if (connection === 'close') {
          const shouldReconnect = 
            lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
          
          console.log('Connection closed due to:', lastDisconnect?.error);
          
          if (shouldReconnect) {
            console.log('Reconnecting to WhatsApp...');
            this.initialize();
          } else {
            console.log('WhatsApp logged out. Please restart and scan QR again.');
            this.isConnected = false;
          }
        } else if (connection === 'open') {
          console.log('WhatsApp connection opened successfully!');
          this.isConnected = true;
          this.qrCodeGenerated = false;
        }
      });

      // Save credentials when updated
      this.sock.ev.on('creds.update', saveCreds);

      // Handle messages (optional - for receiving messages)
      this.sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (!message.key.fromMe && m.type === 'notify') {
          console.log('Received message:', message);
        }
      });

    } catch (error) {
      console.error('Error initializing WhatsApp service:', error);
      throw error;
    }
  }

  async sendMessage(phoneNumber, message) {
    if (!this.isConnected || !this.sock) {
      throw new Error('WhatsApp service is not connected');
    }

    try {
      // Format phone number for WhatsApp (add country code if needed)
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      const jid = `${formattedNumber}@s.whatsapp.net`;

      const result = await this.sock.sendMessage(jid, { text: message });
      console.log('Message sent successfully to:', phoneNumber);
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  formatPhoneNumber(phoneNumber) {
    // Return the phone number as-is without any formatting
    return phoneNumber;
  }

  async sendVerificationCode(phoneNumber, verificationCode) {
    const message = `رمز التحقق الخاص لتطبيق سوق سوريا: ${verificationCode}\n\nهذا الرمز سينتهي صلاحيته خلال 10 دقائق. يرجى عدم مشاركة هذا الرمز مع أي شخص.`;

    try {
      await this.sendMessage(phoneNumber, message);
      return { success: true, message: 'Verification code sent successfully' };
    } catch (error) {
      console.error('Failed to send verification code:', error);
      return { success: false, error: error.message };
    }
  }

  isServiceConnected() {
    return this.isConnected;
  }

  async disconnect() {
    if (this.sock) {
      await this.sock.logout();
      this.isConnected = false;
    }
  }
}

// Create singleton instance
const whatsappService = new WhatsAppService();

module.exports = whatsappService;
