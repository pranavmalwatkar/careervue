# CareerVue

A comprehensive career platform with job listings, CV creation, Private Job and government job opportunities.

## Project Structure

```
careervue/
├── client/          # Frontend React application
│   ├── src/         # React source code
│   ├── public/      # Static assets
│   ├── package.json # Frontend dependencies
│   └── ...         # Frontend config files
├── server/          # Backend Node.js application
│   ├── index.js     # Server entry point
│   ├── routes/      # API routes
│   ├── models/      # Database models
│   ├── middleware/  # Custom middleware
│   ├── utils/       # Utility functions
│   ├── package.json # Backend dependencies
│   └── ...         # Backend files
└── README.md        # This file
```

## Getting Started

### Environment Setup
Before running the application, you need to set up environment variables:

1. Copy the example environment files to create your own:
   ```bash
   # For client
   cp client/.env.example client/.env
   
   # For server
   cp server/.env.example server/.env
   ```

2. Edit the `.env` files with your specific configuration
3. See `ENV_SETUP.md` for detailed information about environment variables

### Frontend (Client)
```bash
cd client
npm install
npm run dev
```

### Backend (Server)
```bash
cd server
npm install
npm run dev
```

### Seeding Demo Data

To populate the database with demo messages for testing the admin dashboard statistics:

```bash
cd server
npm run seed:messages
```

This will create 50 demo messages:
- **45 positive messages (90%)** - with positive keywords and feedback
- **5 neutral/negative messages (10%)** - for realistic data
- Messages distributed across last 30 days
- Various priorities (low, medium, high)
- Different statuses (unread, read, replied, archived)

### Updating Existing Messages

To update existing messages with better content (positive keywords like "good looking website"):

```bash
cd server
npm run update:messages
```

This will:
- Update all existing messages with enhanced content
- Replace simple messages like "hi" with detailed positive feedback
- Maintain 90% positive / 10% neutral ratio
- Keep original metadata (dates, status, priority)

## Features

- User authentication and authorization
- Job listings and applications
- CV creation and management
- Government job opportunities
- Company directory
- Admin dashboard with message statistics and analytics
- Contact message management with visual trend graphs
- Email notifications

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer


## Detailed Feature & Logic Explanation

### 1. User Authentication and Authorization
- **Logic:** Uses JWT for stateless authentication. Passwords are hashed using bcrypt before storing in MongoDB.
- **Modules:** `jsonwebtoken`, `bcrypt`, `express`, `mongoose`
- **Flow:** 
  - Registration: User data is validated, password hashed, and saved.
  - Login: Credentials checked, JWT token issued.
  - Protected routes: Middleware checks JWT token for access.

### 2. Job Listings and Applications
- **Logic:** Jobs are stored in MongoDB. Users can view, search, and apply for jobs.
- **Modules:** `mongoose`, custom models (`Job`, `Application`)
- **Flow:** 
  - Job CRUD operations via REST API.
  - Applications linked to user and job IDs.
  - Admin can post, edit, or delete jobs.

### 3. CV Creation and Management
- **Logic:** Users can create and edit CVs using a React-based form. CVs can be exported as PDF.
- **Modules:** `react`, `html2canvas`, `jspdf`
- **Flow:** 
  - Form data is managed in React state.
  - Export uses html2canvas to capture DOM and jspdf to generate PDF.

### 4. Government Job Opportunities
- **Logic:** Separate section for government jobs, fetched from a dedicated collection or API.
- **Modules:** `mongoose`, React components
- **Flow:** 
  - Government jobs displayed with filters.
  - Users can apply similarly as private jobs.

### 5. Company Directory
- **Logic:** Companies are listed with details and job openings.
- **Modules:** `mongoose`, React components
- **Flow:** 
  - Directory fetched from backend.
  - Users can browse companies and view jobs.

### 6. Admin Dashboard with Message Statistics
- **Logic:** Admins have access to manage users, jobs, applications, and view analytics including message statistics with visual graphs.
- **Modules:** `express`, `mongoose`, React admin components, MongoDB aggregation
- **Flow:** 
  - Role-based access control.
  - Admin routes protected by middleware.
  - Message statistics endpoint (`/api/messages/statistics`) aggregates data:
    - Total message count
    - Messages grouped by status (unread, read, replied, archived)
    - Messages grouped by priority (low, medium, high)
    - Daily message trends for the last 30 days
  - Frontend displays interactive bar graph showing message trends with upward trajectory for positive feedback
  - Real-time statistics update on admin dashboard

### 7. Email Notifications
- **Logic:** Nodemailer is used for sending emails (password reset, welcome, notifications).
- **Modules:** `nodemailer`, custom email templates
- **Flow:** 
  - On password reset, a token is generated and emailed.
  - Uses environment variables for SMTP configuration.

### 8. Environment Variables & Configuration
- **Logic:** Sensitive data and configuration are stored in `.env` files.
- **Modules:** `dotenv`
- **Flow:** 
  - Separate `.env` for client and server.
  - Variables loaded at runtime for security and flexibility.

### 9. Security
- **Logic:** Helmet for HTTP headers, rate limiting, CORS, and secure password storage.
- **Modules:** `helmet`, `express-rate-limit`, `cors`, `bcrypt`
- **Flow:** 
  - Middleware applied globally.
  - Sensitive routes protected.

### 10. Technologies Used
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Other:** JWT, bcrypt, Nodemailer, Stripe (for payments if enabled)

For more details on environment variables, see [ENV_SETUP.md](careervue/ENV_SETUP.md).  
For email setup, see [EMAIL_SETUP.md](careervue/EMAIL_SETUP.md).