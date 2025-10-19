# Environment Variables Setup

## Overview
This project uses environment variables for configuration in both the client and server applications. Environment variables are stored in `.env` files in their respective directories.

## Client Environment Variables
Location: `client/.env`

```
VITE_APP_API_URL=https://careervue-server.vercel.app/
VITE_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### Variables Explanation
- `VITE_APP_API_URL`: The base URL for API requests. In development, this points to the local server.
- `VITE_APP_STRIPE_PUBLISHABLE_KEY`: Public key for Stripe payment integration.

### Usage in Code
In your React components or services, access these variables using:
```typescript
const apiUrl = import.meta.env.VITE_APP_API_URL;
const stripeKey = import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY;
```

## Server Environment Variables
Location: `server/.env`

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/careervue
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CLIENT_URL=http://localhost:5173

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### Variables Explanation
- `NODE_ENV`: Application environment (development, production, test)
- `PORT`: Port on which the server runs
- `MONGODB_URI`: Connection string for MongoDB
- `JWT_SECRET`: Secret key for JWT token generation
- `CLIENT_URL`: URL of the client application for CORS
- `STRIPE_SECRET_KEY`: Secret key for Stripe payment processing
- `STRIPE_PUBLISHABLE_KEY`: Public key for Stripe (same as client)
- `EMAIL_*`: Configuration for email notifications

### Usage in Code
In your Node.js files, access these variables using:
```javascript
const port = process.env.PORT;
const mongoUri = process.env.MONGODB_URI;
```

## Important Notes
1. Never commit `.env` files to version control
2. Use `.env.example` files as templates
3. In production, set environment variables through your hosting platform
4. For local development, create these files manually

## Setting Up for Development
1. Create both `.env` files in their respective directories
2. Fill in the values according to your local setup
3. Restart the development servers to apply changes