const whatsappService = require('../../../utils/whatsappService');

const sendVerificationWhatsApp = async (phoneNumber, verificationCode) => {
  try {
    if (!phoneNumber || !verificationCode) {
      throw new Error('Phone number and verification code are required');
    }

    // Check if WhatsApp service is connected
    if (!whatsappService.isServiceConnected()) {
      throw new Error('WhatsApp service is not connected. Please ensure the service is initialized and authenticated.');
    }

    // Send verification code via WhatsApp
    const result = await whatsappService.sendVerificationCode(phoneNumber, verificationCode);
    
    if (result.success) {
      console.log(`Verification code sent to ${phoneNumber} via WhatsApp`);
      return {
        success: true,
        message: 'Verification code sent successfully via WhatsApp',
        phoneNumber: phoneNumber
      };
    } else {
      throw new Error(result.error || 'Failed to send verification code');
    }

  } catch (error) {
    console.error('Error in sendVerificationWhatsApp:', error);
    throw error;
  }
};

module.exports = sendVerificationWhatsApp;
