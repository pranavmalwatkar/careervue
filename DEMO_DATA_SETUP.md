# Demo Data Setup Guide

## Overview
This guide explains how to populate your CareerVue database with demo messages to test the admin dashboard message statistics feature.

## Quick Start

### Step 1: Ensure Server is Set Up
Make sure your MongoDB connection is configured in `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/careervue
```

### Step 2: Run the Message Seeder
```bash
cd server
npm run seed:messages
```

## What Gets Created

The seeder creates **50 demo messages** with the following distribution:

### Message Breakdown
- **45 Positive Messages (90%)**
  - Contains positive keywords: "excellent", "amazing", "great", "wonderful", "fantastic", etc.
  - Reflects good user feedback and satisfaction
  - Shows upward trend in the admin graph

- **5 Neutral/Negative Messages (10%)**
  - Contains suggestions and minor complaints
  - Provides realistic data variation
  - Includes feature requests and improvement suggestions

### Priority Distribution
- **Low Priority**: ~30 messages (routine positive feedback)
- **Medium Priority**: ~15 messages (important feedback)
- **High Priority**: ~5 messages (urgent issues)

### Status Distribution
- **Unread**: ~30% (new messages)
- **Read**: ~30% (viewed messages)
- **Replied**: ~30% (responded messages)
- **Archived**: ~10% (archived messages)

### Time Distribution
- Messages are spread across the **last 30 days**
- Random distribution to show realistic trends
- Creates an upward trajectory in the graph

## Sample Positive Messages

The seeder includes messages like:
- "Excellent Job Portal! This is an amazing platform..."
- "Great Experience - I'm very impressed with the quality..."
- "Outstanding Service - Your platform is outstanding..."
- "Perfect Platform - Perfect job search experience..."
- And 40+ more positive feedback messages

## Sample User Data

Messages are created from 10 sample users:
- Rahul Sharma
- Priya Patel
- Amit Kumar
- Sneha Reddy
- Vikram Singh
- Anjali Gupta
- Rajesh Verma
- Pooja Joshi
- Karan Mehta
- Neha Agarwal

## Viewing the Results

### In Admin Dashboard
1. Start your server: `npm run dev`
2. Start your client: `cd ../client && npm run dev`
3. Log in to admin panel
4. Navigate to **Messages** tab
5. View the **Message Statistics** section at the top

### Expected Graph Behavior
- **Green upward-trending bars** showing message growth
- **Total Messages**: 50
- **Status Breakdown**: Distribution across unread, read, replied, archived
- **Priority Breakdown**: Distribution across low, medium, high
- **Daily Trend**: Messages distributed over 30 days

## Customization

### Modify Number of Messages
Edit `server/data/seedMessages.js`:
```javascript
// Change these numbers
for (let i = 0; i < 45; i++) { // Positive messages
for (let i = 0; i < 5; i++) {  // Neutral messages
```

### Add More Positive Messages
Add to the `positiveMessages` array in `seedMessages.js`:
```javascript
{
  subject: "Your Subject",
  message: "Your positive feedback message...",
  priority: "low" // or "medium" or "high"
}
```

### Change Time Range
Modify the `getRandomDate()` function:
```javascript
const daysAgo = Math.floor(Math.random() * 30); // Change 30 to desired days
```

## Clearing Demo Data

To remove all messages and start fresh:

1. Uncomment these lines in `seedMessages.js`:
```javascript
await Message.deleteMany({});
console.log('Cleared existing messages');
```

2. Run the seeder again:
```bash
npm run seed:messages
```

## Troubleshooting

### Error: Cannot connect to MongoDB
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Verify database name is correct

### Error: Module not found
- Run `npm install` in the server directory
- Ensure all dependencies are installed

### Messages not showing in admin
- Verify you're logged in as admin
- Check admin permissions include `messages:view`
- Refresh the admin dashboard

## Production Note

⚠️ **Important**: This seeder is for **development/testing only**. Do not run on production databases as it will add demo data.

## Next Steps

After seeding:
1. View the admin dashboard statistics
2. Test the interactive graph features
3. Check message filtering by status/priority
4. Verify the upward trend visualization
5. Test message management features

## Support

For issues or questions:
- Check the main README.md
- Review MESSAGE_STATISTICS_FEATURE.md
- Check server logs for errors
