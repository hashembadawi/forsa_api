const { 
  default: makeWASocket, 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const path = require('path');

class WhatsAppService {
  constructor() {
    this.sock = null;
    this.isConnected = false;
    this.qrCodeGenerated = false;
    this.qrAttempts = 0;
    this.logger = console; // Simple console logger
  }

  async initialize() {
    try {
      // Use auth state from a folder
      const { state, saveCreds } = await useMultiFileAuthState(
        path.join(__dirname, '../../auth_info_baileys')
      );

      // Fetch latest Baileys version (Baileys 7.0 feature)
      const { version, isLatest } = await fetchLatestBaileysVersion();
      console.log(`Using WA v${version.join('.')}, isLatest: ${isLatest}`);

      // Initialize socket with Baileys 7.0 configuration
      this.sock = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, this.logger),
        },
        printQRInTerminal: false,
        version,
        generateHighQualityLinkPreview: true,
      });

      // Save credentials when updated
      this.sock.ev.on('creds.update', saveCreds);

      // Handle LID mapping updates (new in Baileys 7.0)
      this.sock.ev.on('lid-mapping.update', (update) => {
        console.log('LID mapping update:', update);
      });

      // Handle connection updates
      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrAttempts++;
          console.log(`QR Code for WhatsApp Web (Attempt ${this.qrAttempts}/5):`);
          qrcode.generate(qr, { small: true });
          this.qrCodeGenerated = true;
          console.log('Please scan this QR code with your WhatsApp mobile app.');
          
          if (this.qrAttempts >= 5) {
            console.log('Max QR attempts reached. Please restart the service.');
            this.isConnected = false;
            return;
          }
        }

        if (connection === 'close') {
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          
          console.log('Connection closed:', {
            statusCode,
            reason: lastDisconnect?.error?.output?.payload?.message,
            shouldReconnect
          });
          
          if (statusCode === DisconnectReason.connectionClosed) {
            console.log('Connection closed, attempting to reconnect in 3s...');
            setTimeout(() => this.initialize(), 3000);
          } else if (shouldReconnect && this.qrAttempts < 5) {
            console.log('Reconnecting to WhatsApp in 3s...');
            setTimeout(() => this.initialize(), 3000);
          } else {
            console.log('WhatsApp logged out or max retries reached. Please restart and scan QR again.');
            this.isConnected = false;
          }
        } else if (connection === 'open') {
          console.log('WhatsApp connection opened successfully!');
          this.isConnected = true;
          this.qrCodeGenerated = false;
          this.qrAttempts = 0;
        }
      });

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
      // Normalize JID using LID if available (Baileys 7.0 feature)
      const jid = await this.normalizeJid(phoneNumber);
      
      const result = await this.sock.sendMessage(jid, { text: message });
      console.log('Message sent successfully to:', phoneNumber);
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async normalizeJid(rawId) {
    try {
      let jid = rawId.trim();

      // If it's already a properly formatted JID, return as is
      if (jid.includes('@lid') || jid.includes('@g.us') || jid.includes('@newsletter')) {
        return jid;
      }

      // Clean up the input and add @s.whatsapp.net if needed
      jid = jid.replace('+', '');
      if (!jid.includes('@')) {
        jid += '@s.whatsapp.net';
      }

      // Try to get LID for the phone number (Baileys 7.0 feature)
      if (this.sock?.signalRepository?.lidMapping) {
        const phoneNumber = jid.replace('@s.whatsapp.net', '');
        const lids = await this.sock.signalRepository.lidMapping.getLIDsForPNs([phoneNumber]);

        if (lids && lids[phoneNumber]) {
          console.log('Using LID for messaging:', lids[phoneNumber]);
          return lids[phoneNumber];
        }
      }

      // If no LID found, return the phone number JID
      return jid;
    } catch (error) {
      console.log('Error normalizing JID, using as-is:', error.message);
      // Fallback: ensure it has proper suffix
      let fallbackJid = rawId.replace('+', '');
      if (!fallbackJid.includes('@')) {
        fallbackJid += '@s.whatsapp.net';
      }
      return fallbackJid;
    }
  }

  formatPhoneNumber(phoneNumber) {
    // Return the phone number as-is without any formatting
    return phoneNumber;
  }

  async sendVerificationCode(phoneNumber, verificationCode) {
    const message = `رمز التحقق الخاص لتطبيق فرصة: ${verificationCode}\n\nهذا الرمز سينتهي صلاحيته خلال 10 دقائق. يرجى عدم مشاركة هذا الرمز مع أي شخص.`;

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
