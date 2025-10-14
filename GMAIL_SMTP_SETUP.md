# Gmail SMTP Setup Guide for Careervue

This guide will help you configure Gmail SMTP server for sending forgot password emails and other notifications.

## Prerequisites

1. A Gmail account
2. 2-Step Verification enabled on your Gmail account
3. An App Password generated for your application

## Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on "2-Step Verification"
3. Follow the steps to enable it if not already enabled

## Step 2: Generate an App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on "2-Step Verification"
3. Scroll down and click on "App passwords"
4. Select "Mail" as the app and "Other" as the device
5. Click "Generate"
6. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

## Step 3: Create Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/careervue

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Gmail SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development

# Server Port
PORT=5000
```

**Important Notes:**
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `your-16-character-app-password` with the app password generated in Step 2
- **Never commit your `.env` file to version control**

## Step 4: Test the Email Service

1. Start your server: `npm run server`
2. Navigate to the forgot password page in your application
3. Enter your email address
4. Check your email for the password reset link

## Troubleshooting

### Common Issues:

1. **"Invalid login" error:**
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2-Step Verification is enabled

2. **"Less secure app access" error:**
   - This is normal and expected - Gmail will show this warning
   - The app password method is the secure way to handle this

3. **"Connection timeout" error:**
   - Check your internet connection
   - Ensure port 587 is not blocked by your firewall

4. **"Authentication failed" error:**
   - Double-check your email and app password
   - Make sure there are no extra spaces in the app password

### Gmail SMTP Settings:

- **Host:** smtp.gmail.com
- **Port:** 587
- **Security:** STARTTLS
- **Authentication:** Required
- **Username:** Your Gmail address
- **Password:** Your 16-character app password

## Security Best Practices

1. **Never share your app password**
2. **Use environment variables** for sensitive information
3. **Keep your `.env` file secure** and never commit it to version control
4. **Regularly rotate your app passwords** if needed
5. **Monitor your Gmail account** for any suspicious activity

## Alternative: Development Mode

If you don't want to set up Gmail SMTP for development, the system will automatically use Ethereal Email (a test email service) when no `EMAIL_USER` is provided. This is perfect for development and testing.

## Production Deployment

When deploying to production:

1. Set `NODE_ENV=production`
2. Ensure your environment variables are properly configured
3. Use a production-ready email service or Gmail SMTP
4. Monitor email delivery rates and bounce rates

## Testing the Setup

You can test the email service by:

1. Starting the server: `npm run server`
2. Using the forgot password functionality
3. Checking the server console for email sending logs
4. Verifying the email is received in your inbox

The system will automatically detect whether to use Gmail SMTP or the test email service based on your environment configuration. 