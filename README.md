# 🚀 CareerVue

> A comprehensive career platform with intelligent analytics, job listings, CV creation, and government job opportunities.

## ✨ What's New

🎯 **Sentiment Analysis** - AI-powered feedback detection  
📊 **Vertical Bar Charts** - Professional data visualization  
🔄 **Auto-read Status** - Smart message management  
📈 **Real-time Analytics** - Live dashboard statistics  

---

## Project Structure

```
careervue/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   └── admin/
│   │   │       ├── MessageStatistics.tsx    # 📊 Vertical bar chart
│   │   │       └── MessageManagement.tsx    # Message list & details
│   │   ├── services/
│   │   │   └── adminAPI.ts                  # API service layer
│   │   └── ...
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
├── server/                      # Backend Node.js application
│   ├── index.js                 # Server entry point
│   ├── routes/
│   │   ├── admin.js             # Admin routes with statistics
│   │   └── messages.js          # Message CRUD with auto-read
│   ├── models/
│   │   └── Message.js           # Message schema
│   ├── middleware/
│   │   └── adminAuth.js         # Admin authentication
│   ├── utils/
│   │   └── sentimentAnalysis.js # 🎯 Sentiment engine (NEW)
│   ├── data/
│   │   ├── seedMessages.js      # Demo message seeder
│   │   └── updateMessages.js    # Message updater (NEW)
│   └── package.json             # Backend dependencies
├── SENTIMENT_ANALYSIS_FEATURE.md # 📚 Sentiment docs (NEW)
├── VERTICAL_BAR_CHART.md         # 📚 Chart docs (NEW)
├── BAR_CHART_FEATURES.md         # 📚 Features docs (NEW)
├── UPDATE_MESSAGES_GUIDE.md      # 📚 Update guide (NEW)
└── README.md                     # This file
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
- **Admin dashboard with advanced analytics:**
  - 📊 **Vertical Bar Chart** - Message trend visualization
  - 🎯 **Sentiment Analysis** - AI-powered keyword detection
  - 📈 **Real-time Statistics** - Live message tracking
  - 🔄 **Auto-read Status** - Automatic message status updates
- Contact message management with visual trend graphs
- Email notifications
- **Intelligent Message Analysis:**
  - Positive/Negative keyword detection (70+ keywords)
  - Color-coded sentiment indicators
  - Interactive tooltips with detailed breakdowns

## Technologies & Algorithms

### Core Technologies
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt (password hashing)
- **Email**: Nodemailer (SMTP email service)

### Algorithms & Techniques Used

#### 1. **Sentiment Analysis Algorithm**
- **Type**: Keyword-based Text Analysis
- **Method**: Pattern Matching with Regular Expressions
- **Logic**: 
  ```
  Score = (Positive Keywords - Negative Keywords) / Total Keywords
  Classification:
    - Score > 0.3  → Positive
    - Score < -0.3 → Negative
    - Otherwise    → Neutral
  ```
- **Complexity**: O(n×m) where n = text length, m = keyword count

#### 2. **Password Hashing Algorithm**
- **Algorithm**: bcrypt (Blowfish-based)
- **Rounds**: 10 (default salt rounds)
- **Security**: One-way hash with salt
- **Purpose**: Secure password storage

#### 3. **JWT Token Algorithm**
- **Algorithm**: HMAC SHA256 (HS256)
- **Components**: Header + Payload + Signature
- **Expiration**: Configurable (typically 24h)
- **Purpose**: Stateless authentication

#### 4. **MongoDB Aggregation Pipeline**
- **Type**: Data aggregation framework
- **Operations**: $group, $match, $sort, $project
- **Purpose**: Efficient data analysis and statistics
- **Usage**: Message statistics, daily trends

#### 5. **Data Visualization Algorithm**
- **Type**: Proportional scaling
- **Formula**: `height = (value / maxValue) × 100%`
- **Purpose**: Vertical bar chart rendering
- **Optimization**: Client-side calculation

#### 6. **Rate Limiting Algorithm**
- **Type**: Token Bucket / Fixed Window
- **Library**: express-rate-limit
- **Limit**: 100 requests per 15 minutes per IP
- **Purpose**: DDoS protection

### Email Service (Nodemailer)
- **Module**: `nodemailer` (Node.js email module)
- **Protocol**: SMTP (Simple Mail Transfer Protocol)
- **Features**:
  - HTML email templates
  - Attachment support
  - Multiple transport options (Gmail, SendGrid, etc.)
  - Queue management
- **Use Cases**:
  - Password reset emails
  - Welcome emails
  - Application notifications
  - Admin alerts


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

### 6. Admin Dashboard with Advanced Message Analytics
- **Logic:** Comprehensive admin panel with sentiment analysis, vertical bar charts, and real-time statistics.
- **Modules:** `express`, `mongoose`, React admin components, MongoDB aggregation, custom sentiment analysis
- **Flow:** 
  - **Role-based access control** - Admin authentication required
  - **Sentiment Analysis Engine** (`server/utils/sentimentAnalysis.js`):
    - Analyzes 40+ positive keywords (good, excellent, amazing, professional, etc.)
    - Detects 30+ negative keywords (bad, slow, broken, error, etc.)
    - Calculates sentiment score (-1 to 1)
    - Classifies as positive/neutral/negative
  - **Statistics API** (`GET /api/admin/messages/statistics`):
    - Total message count
    - Messages by status (unread, read, replied, archived)
    - Messages by priority (low, medium, high)
    - Daily trends with sentiment breakdown (last 30 days)
    - Overall sentiment statistics (positive %, negative %, neutral %)
  - **Vertical Bar Chart Visualization:**
    - 📊 Professional chart with Y-axis scale (0-max)
    - 🟢 Green bars = Positive feedback (>50% positive keywords)
    - ⚪ Gray bars = Neutral feedback
    - 🔴 Red bars = Negative feedback (>50% negative keywords)
    - Interactive tooltips showing detailed sentiment breakdown
    - Grid lines and axis labels for clarity
    - Hover effects with smooth animations
  - **Auto-read Feature:**
    - Messages automatically marked as "read" when admin views details
    - No manual status update required
  - **Manual Status Control:**
    - Admin can change status via dropdown (unread/read/replied/archived)
    - Admin can change priority via dropdown (low/medium/high)
    - Changes save automatically and refresh statistics

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
- **Analytics:** Custom sentiment analysis engine, MongoDB aggregation
- **Visualization:** Custom vertical bar charts with interactive tooltips
- **Other:** JWT, bcrypt, Nodemailer, Stripe (for payments if enabled)

## 📊 New Features Documentation

### Sentiment Analysis System
Intelligent keyword-based sentiment analysis for user feedback:
- **40+ Positive Keywords:** good, excellent, amazing, professional, beautiful, etc.
- **30+ Negative Keywords:** bad, slow, broken, error, confusing, etc.
- **Automatic Classification:** Messages categorized as positive/neutral/negative
- **Real-time Analysis:** Sentiment calculated on-the-fly for statistics
- See [SENTIMENT_ANALYSIS_FEATURE.md](SENTIMENT_ANALYSIS_FEATURE.md) for details

### Vertical Bar Chart Visualization
Professional data visualization for message trends:
- **Interactive Charts:** Hover to see detailed breakdowns
- **Color-Coded Bars:** Green (positive), Gray (neutral), Red (negative)
- **Grid Lines & Axes:** Professional chart formatting
- **Responsive Design:** Works on all screen sizes
- **Smooth Animations:** Polished user experience
- See [VERTICAL_BAR_CHART.md](VERTICAL_BAR_CHART.md) for details

### Auto-Read Status Feature
Automatic message status management:
- Messages auto-change from "unread" to "read" when viewed
- Reduces manual work for admins
- Helps track which messages have been reviewed
- See [BAR_CHART_FEATURES.md](BAR_CHART_FEATURES.md) for details

### Message Update Utility
Bulk update messages with enhanced content:
- Replace simple messages with detailed positive feedback
- Maintain sentiment ratios (90% positive recommended)
- Keep original metadata intact
- See [UPDATE_MESSAGES_GUIDE.md](UPDATE_MESSAGES_GUIDE.md) for usage

## 📚 Additional Documentation

- **Environment Setup:** [ENV_SETUP.md](careervue/ENV_SETUP.md)
- **Email Configuration:** [EMAIL_SETUP.md](careervue/EMAIL_SETUP.md)
- **Sentiment Analysis:** [SENTIMENT_ANALYSIS_FEATURE.md](SENTIMENT_ANALYSIS_FEATURE.md)
- **Vertical Bar Chart:** [VERTICAL_BAR_CHART.md](VERTICAL_BAR_CHART.md)
- **Bar Chart Features:** [BAR_CHART_FEATURES.md](BAR_CHART_FEATURES.md)
- **Update Messages Guide:** [UPDATE_MESSAGES_GUIDE.md](UPDATE_MESSAGES_GUIDE.md)

## 🚀 Quick Start Guide

1. **Install Dependencies:**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd client
   npm install
   ```

2. **Setup Environment:**
   ```bash
   # Copy and configure .env files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. **Seed Demo Data:**
   ```bash
   cd server
   npm run seed:admin      # Create admin account
   npm run seed:messages   # Create demo messages (90% positive)
   ```

4. **Run Application:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Access Admin Dashboard:**
   - Navigate to admin panel
   - Login with admin credentials
   - View Messages tab for analytics
   - See vertical bar chart with sentiment analysis! 📊

## 🎯 Key Highlights

✅ **Sentiment Analysis** - Automatically detect positive/negative feedback  
✅ **Vertical Bar Charts** - Professional data visualization  
✅ **Auto-read Status** - Smart message management  
✅ **Interactive Tooltips** - Detailed sentiment breakdowns  
✅ **Color-coded Indicators** - Quick visual feedback  
✅ **Real-time Statistics** - Live dashboard updates  
✅ **Manual Controls** - Admin can override status/priority  
✅ **Responsive Design** - Works on all devices  

## 📈 Understanding the Dashboard

### Green Bars (Positive Feedback)
- Users are happy with the platform
- Website performing well
- Good user experience
- Keywords: "good", "excellent", "professional", "love"

### Gray Bars (Neutral Feedback)
- Balanced feedback
- No strong sentiment
- General inquiries

### Red Bars (Negative Feedback)
- Issues detected
- User complaints
- Needs immediate attention
- Keywords: "slow", "broken", "error", "bad"

## 🛠️ Maintenance Commands

```bash
# Update existing messages to positive feedback
npm run update:messages

# Seed new demo messages
npm run seed:messages

# Create admin account
npm run seed:admin
```

## 📞 Support

For issues or questions about the new features:
1. Check the relevant documentation file
2. Review console logs for errors
3. Verify MongoDB connection
4. Test with demo data first

---

## ❓ Frequently Asked Questions (FAQ)

### 1. **What is CareerVue and what does it do?**
**Answer:** CareerVue is a comprehensive career platform that helps job seekers find employment opportunities and manage their job applications. It features:
- Job listings (private and government sectors)
- CV/Resume creation and management
- Application tracking
- Company directory
- Admin dashboard with intelligent analytics
- Sentiment analysis for user feedback
- Real-time message statistics with visual charts

### 2. **What algorithms are used in CareerVue?**
**Answer:** CareerVue uses several algorithms:
- **Sentiment Analysis**: Keyword-based text analysis with pattern matching (O(n×m) complexity)
- **bcrypt**: Blowfish-based password hashing with 10 salt rounds
- **JWT (HS256)**: HMAC SHA256 for authentication tokens
- **MongoDB Aggregation**: Data pipeline for statistics ($group, $match, $sort)
- **Proportional Scaling**: For vertical bar chart visualization
- **Rate Limiting**: Token bucket algorithm for DDoS protection

### 3. **How does the sentiment analysis work?**
**Answer:** The sentiment analysis uses keyword-based pattern matching:
- Scans messages for 40+ positive keywords (good, excellent, amazing, etc.)
- Scans for 30+ negative keywords (bad, slow, broken, etc.)
- Calculates score: `(Positive - Negative) / Total`
- Classifies as Positive (>0.3), Negative (<-0.3), or Neutral
- Results displayed in color-coded vertical bar charts (Green/Gray/Red)

### 4. **What email service does CareerVue use?**
**Answer:** CareerVue uses **Nodemailer**, a Node.js module for sending emails via SMTP protocol. Features include:
- HTML email templates
- Attachment support
- Multiple transport options (Gmail, SendGrid, custom SMTP)
- Used for password resets, welcome emails, notifications, and admin alerts
- Configurable via environment variables

### 5. **How secure is user data in CareerVue?**
**Answer:** CareerVue implements multiple security measures:
- **Password Security**: bcrypt hashing with salt (10 rounds)
- **Authentication**: JWT tokens with expiration
- **HTTP Security**: Helmet middleware for secure headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Cross-Origin Resource Sharing protection
- **Environment Variables**: Sensitive data stored in .env files
- **MongoDB**: Secure database with authentication

### 6. **What is the vertical bar chart and how do I read it?**
**Answer:** The vertical bar chart visualizes message trends over the last 30 days:
- **Green bars**: Positive feedback (>50% positive keywords) - Users are happy
- **Gray bars**: Neutral feedback - Balanced sentiment
- **Red bars**: Negative feedback (>50% negative keywords) - Issues detected
- **Height**: Represents message count (taller = more messages)
- **Hover**: Shows detailed breakdown (positive/neutral/negative counts)
- **Grid lines**: Help estimate exact values

### 7. **How do I update existing messages to positive feedback?**
**Answer:** Use the message update utility:
```bash
cd server
npm run update:messages
```
This will:
- Update all existing messages with enhanced positive content
- Replace simple messages like "hi" with detailed feedback
- Maintain 100% positive messages (or configure ratio)
- Keep original metadata (dates, status, priority)
- Show progress and completion statistics

### 8. **What technologies and frameworks power CareerVue?**
**Answer:** 
**Frontend:**
- React 18 (UI library)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Vite (build tool)

**Backend:**
- Node.js (runtime)
- Express.js (web framework)
- MongoDB (database)
- Mongoose (ODM)

**Additional:**
- JWT (authentication)
- bcrypt (password hashing)
- Nodemailer (email service)
- Helmet (security)
- express-rate-limit (DDoS protection)

### 9. **How does the auto-read status feature work?**
**Answer:** The auto-read feature automatically updates message status:
- When admin clicks "View Details" on a message
- System checks if status is "unread"
- If yes, automatically changes to "read"
- Saves to database immediately
- No manual status update needed
- Helps track which messages have been reviewed
- Admin can still manually change status via dropdown if needed

### 10. **Can I customize the sentiment analysis keywords?**
**Answer:** Yes! The keywords are defined in `server/utils/sentimentAnalysis.js`:
```javascript
// Add your custom positive keywords
const positiveKeywords = [
  'good', 'excellent', 'amazing',
  'your-custom-keyword'  // Add here
];

// Add your custom negative keywords
const negativeKeywords = [
  'bad', 'slow', 'broken',
  'your-custom-keyword'  // Add here
];
```
After modifying:
1. Save the file
2. Restart the server
3. New keywords will be used in analysis
4. Existing statistics will be recalculated

### 11. **BONUS: How do I deploy CareerVue to production?**
**Answer:** 
1. **Setup Environment:**
   - Configure production .env files
   - Set secure JWT_SECRET
   - Configure production MongoDB URI
   - Setup email SMTP credentials

2. **Build Frontend:**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy Options:**
   - **Frontend**: Vercel, Netlify, or serve from Express
   - **Backend**: Heroku, DigitalOcean, AWS, or Railway
   - **Database**: MongoDB Atlas (cloud)

4. **Security Checklist:**
   - Enable HTTPS
   - Set secure CORS origins
   - Enable rate limiting
   - Use strong JWT secrets
   - Regular security updates

---

## 📧 Contact & Support

**For Technical Issues:**
- Check documentation files
- Review error logs
- Test with demo data

**For Feature Requests:**
- Submit via GitHub issues
- Include detailed description
- Provide use case examples

**For General Inquiries:**
- Email: support@careervue.com (example)
- Documentation: See README.md and related docs

---

**CareerVue** - Empowering careers with intelligent analytics 🚀

*Built with ❤️ using React, Node.js, and MongoDB*