# Email Setup Guide for Careervue

## Overview
This guide explains how to set up email functionality for the forgot password feature in Careervue.

## Current Status
✅ **Email service implemented** - Uses Nodemailer with both development and production configurations  
✅ **Password reset emails** - Professional HTML emails with reset links  
✅ **Development mode** - Uses Ethereal Email for testing (no real emails sent)  
✅ **Production mode** - Configured for Gmail SMTP  

## Development Mode (Default)
When `NODE_ENV` is not set to 'production', the system uses **Ethereal Email**:
- Creates temporary test email accounts
- Shows preview URLs in the console and UI
- Perfect for development and testing
- No real emails are sent

## Production Mode Setup

### 1. Gmail Configuration (Recommended)
1. **Enable 2-Step Verification** on your Google account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification
   - Click "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Enter "Careervue" as the name
   - Copy the generated 16-character password

### 2. Environment Variables
Create a `.env` file in your server directory with:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Environment
NODE_ENV=production

# Other required variables
JWT_SECRET=your-jwt-secret
MONGODB_URI=your-mongodb-connection-string
```

### 3. Alternative Email Providers

#### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password'
  }
});
```

#### Custom SMTP Server
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-server.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@domain.com',
    pass: 'your-password'
  }
});
```

## Testing the Email System

### 1. Development Testing
1. Request a password reset
2. Check the console for email preview URL
3. Click "View Email Preview" button in the UI
4. Verify the email content and reset link

### 2. Production Testing
1. Set `NODE_ENV=production` in your `.env`
2. Configure real email credentials
3. Request a password reset
4. Check your email inbox
5. Click the reset link to verify it works

## Email Templates

The system includes:
- **Password Reset Email**: Professional HTML template with reset button
- **Welcome Email**: Optional welcome message for new users
- **Responsive Design**: Works on both desktop and mobile
- **Branding**: Uses Careervue colors and logo

## Troubleshooting

### Common Issues

#### "Email sending failed"
- Check your email credentials
- Verify 2-Step Verification is enabled (Gmail)
- Ensure App Password is correct
- Check firewall/network restrictions

#### "Preview URL not working"
- Only available in development mode
- Check browser console for errors
- Verify Ethereal Email service is accessible

#### "Reset link not working"
- Check if token has expired (1 hour limit)
- Verify the reset link URL format
- Ensure the token is properly stored in database

### Debug Mode
Enable detailed logging by adding to your server:

```javascript
// In server/index.js or routeAuth.js
console.log('Email configuration:', {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? '***' : 'not set',
  env: process.env.NODE_ENV
});
```

## Security Considerations

1. **App Passwords**: Never use your main Google password
2. **Environment Variables**: Keep `.env` file secure and never commit to git
3. **Token Expiration**: Reset tokens expire after 1 hour
4. **Rate Limiting**: Consider adding rate limiting to prevent abuse
5. **Email Validation**: Verify email format before sending

## Next Steps

1. **Test in development mode** first
2. **Configure production email** when ready to deploy
3. **Monitor email delivery** in production
4. **Consider email analytics** for better insights
5. **Add email templates** for other notifications

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify your email configuration
3. Test with a simple email first
4. Check Nodemailer documentation for your email provider 