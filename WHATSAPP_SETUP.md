# WhatsApp Verification Setup with Baileys

This guide explains how to set up and use WhatsApp verification in your Syria Market API.

## Overview

The WhatsApp verification system has been implemented using Baileys library to send verification codes via WhatsApp messages.

## Files Created/Modified

### New Files:
- `src/utils/whatsappService.js` - Core WhatsApp service using Baileys
- `src/application/useCases/user/sendVerificationWhatsApp.js` - Use case for sending verification
- `src/application/useCases/user/verifyUser.js` - Use case for verifying users
- `src/services/whatsappInitializer.js` - Service initializer

### Modified Files:
- `src/application/useCases/user/registerUser.js` - Now sends WhatsApp verification
- `src/adapters/controllers/userController.js` - Added verification endpoints
- `src/adapters/routes/userRoutes.js` - Added verification routes
- `server.js` - Initializes WhatsApp service on startup

## How to Setup

### 1. Initial Setup
When you start your server for the first time, you'll see a QR code in the terminal:

```bash
npm start
```

### 2. WhatsApp Authentication
1. Open WhatsApp on your phone
2. Go to Settings > Linked Devices
3. Scan the QR code shown in your terminal
4. Your server is now connected to WhatsApp!

### 3. API Endpoints

#### Register User (with WhatsApp verification)
```
POST /api/user/register-phone
```
Body:
```json
{
  "phoneNumber": "0932123456",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123",
  "profileImage": "optional_image_url"
}
```

#### Send Verification Code
```
POST /api/user/send-verification
```
Body:
```json
{
  "phoneNumber": "0932123456"
}
```

#### Verify Phone Number
```
POST /api/user/verify-phone
```
Body:
```json
{
  "phoneNumber": "0932123456",
  "verificationCode": "1234"
}
```

## Phone Number Format

The system automatically handles Syrian phone numbers:
- Input: `0932123456` → Converts to: `963932123456`
- Already formatted numbers are preserved
- Country code 963 (Syria) is added if missing

## Features

### Automatic Verification on Registration
- When a user registers, a verification code is automatically sent via WhatsApp
- The user remains unverified until they confirm the code

### Manual Verification Resend
- Users can request a new verification code if needed
- Existing codes are reused if still valid

### User Verification Status
- Users have an `isVerified` field in the database
- Only verified users should be allowed to perform certain actions

## Error Handling

The system handles various error scenarios:
- WhatsApp service not connected
- Invalid phone numbers
- Failed message delivery
- Invalid verification codes

## Security Notes

1. **Verification Code Expiry**: Consider implementing code expiry (currently not implemented)
2. **Rate Limiting**: Add rate limiting to prevent spam
3. **Code Attempts**: Limit verification attempts per user

## Troubleshooting

### QR Code Not Appearing
- Restart the server
- Check console for errors
- Ensure WhatsApp Web is not open elsewhere

### Messages Not Sending
- Verify WhatsApp connection status
- Check phone number format
- Ensure the number exists on WhatsApp

### Connection Lost
- The service will automatically attempt to reconnect
- If logged out, you'll need to scan QR code again

## Production Considerations

1. **Persistent Authentication**: The auth info is saved in `src/auth_info_baileys/` folder
2. **Process Management**: Use PM2 or similar for process management
3. **Error Monitoring**: Implement proper logging and monitoring
4. **Backup**: Backup the auth_info_baileys folder

## Testing

You can test the integration by:
1. Starting the server
2. Registering a new user with your WhatsApp number
3. Checking if you receive the verification code
4. Verifying with the received code

## Next Steps

Consider implementing:
- Code expiry mechanism
- Rate limiting
- SMS fallback for non-WhatsApp numbers
- Bulk message capabilities
- Message templates
