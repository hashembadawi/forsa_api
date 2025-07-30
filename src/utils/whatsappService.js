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
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          
          console.log('Connection closed due to:', lastDisconnect?.error);
          console.log('Status code:', statusCode);
          
          if (statusCode === DisconnectReason.badSession || 
              statusCode === DisconnectReason.restartRequired ||
              statusCode === 401) {
            console.log('Session expired or invalid. Clearing auth and requiring new QR scan...');
            this.isConnected = false;
            this.qrCodeGenerated = false;
            // Clear the auth folder and restart
            setTimeout(() => this.clearAuthAndRestart(), 2000);
          } else if (shouldReconnect) {
            console.log('Reconnecting to WhatsApp...');
            setTimeout(() => this.initialize(), 5000);
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
      throw new Error('WhatsApp service is not connected. Please wait for connection or scan QR code.');
    }

    try {
      // Use phone number as-is
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      const jid = `${formattedNumber}@s.whatsapp.net`;

      const result = await this.sock.sendMessage(jid, { text: message });
      console.log('Message sent successfully to:', phoneNumber);
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      
      // If it's a connection error, try to reinitialize
      if (error.message.includes('Connection') || error.output?.statusCode === 401) {
        console.log('Connection lost, attempting to reinitialize...');
        this.isConnected = false;
        this.clearAuthAndRestart();
      }
      
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

  async clearAuthAndRestart() {
    try {
      const fs = require('fs');
      const authPath = path.join(__dirname, '../../auth_info_baileys');
      
      // Remove auth folder if it exists
      if (fs.existsSync(authPath)) {
        fs.rmSync(authPath, { recursive: true, force: true });
        console.log('Cleared old authentication data.');
      }
      
      // Reset state
      this.sock = null;
      this.isConnected = false;
      this.qrCodeGenerated = false;
      
      // Restart initialization
      console.log('Restarting WhatsApp service...');
      await this.initialize();
    } catch (error) {
      console.error('Error clearing auth and restarting:', error);
    }
  }
}

// Create singleton instance
const whatsappService = new WhatsAppService();

module.exports = whatsappService;
