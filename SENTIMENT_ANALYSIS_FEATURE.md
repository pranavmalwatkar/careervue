# Sentiment Analysis Feature

## Overview
This feature adds intelligent sentiment analysis to messages, displaying color-coded graphs based on positive/negative keywords and automatically marking messages as "read" when viewing details.

## Features Implemented

### 1. Keyword-Based Sentiment Analysis
**File:** `server/utils/sentimentAnalysis.js`

#### Positive Keywords (40+)
- good, great, excellent, amazing, wonderful, fantastic, awesome
- perfect, outstanding, superb, brilliant, impressive, love
- best, helpful, satisfied, happy, pleased, thank, thanks
- appreciate, grateful, recommend, professional, quality
- efficient, smooth, easy, user-friendly, reliable, fast
- beautiful, modern, clean, intuitive, useful, valuable

#### Negative Keywords (30+)
- bad, poor, terrible, awful, horrible, worst, hate
- disappointed, frustrating, slow, difficult, confusing
- broken, error, bug, issue, problem, fail, failed
- not working, useless, waste, annoying, irritating
- outdated, old, ugly, messy, hard, impossible

#### Sentiment Scoring
- **Positive**: Score > 0.3 (more positive keywords)
- **Neutral**: Score between -0.3 and 0.3
- **Negative**: Score < -0.3 (more negative keywords)

### 2. Auto-Read Status
**File:** `server/routes/messages.js`

When admin clicks to view message details:
- Status automatically changes from `unread` → `read`
- Helps track which messages have been reviewed
- No manual status update needed

### 3. Enhanced Statistics API
**File:** `server/routes/admin.js`

**Endpoint:** `GET /api/admin/messages/statistics`

**Returns:**
```json
{
  "success": true,
  "data": {
    "totalMessages": 50,
    "messagesByStatus": [...],
    "dailyMessages": [
      {
        "date": "2025-10-18",
        "count": 5,
        "positive": 4,
        "negative": 0,
        "neutral": 1
      }
    ],
    "messagesByPriority": [...],
    "sentimentStats": {
      "total": 50,
      "positive": 45,
      "negative": 2,
      "neutral": 3,
      "positivePercentage": 90.0,
      "negativePercentage": 4.0,
      "neutralPercentage": 6.0
    }
  }
}
```

### 4. Visual Sentiment Dashboard
**File:** `client/src/components/admin/MessageStatistics.tsx`

#### Sentiment Overview Cards
- **Green Card**: Positive feedback count & percentage
- **Gray Card**: Neutral feedback count & percentage
- **Red Card**: Negative feedback count & percentage

#### Color-Coded Graph
- **Green Bars**: Majority positive feedback (>50% positive keywords)
- **Gray Bars**: Neutral feedback
- **Red Bars**: Majority negative feedback (>50% negative keywords)

#### Interactive Tooltips
Hover over any bar to see:
- Total messages for that day
- ✓ Positive count
- ○ Neutral count
- ✗ Negative count
- Date

#### Color Legend
Visual legend explaining:
- Green = Positive Feedback
- Gray = Neutral
- Red = Negative Feedback

## How It Works

### Message Analysis Flow
```
1. User submits message with text: "This is a great website! Love it!"
   ↓
2. Backend receives message and stores in database
   ↓
3. Admin views statistics
   ↓
4. System analyzes message content:
   - Finds keywords: "great" (positive), "love" (positive)
   - Calculates sentiment: POSITIVE
   ↓
5. Graph displays green bar for that day
   ↓
6. Admin clicks message to view details
   ↓
7. Status auto-changes: unread → read
```

### Sentiment Calculation Example

**Message:** "Excellent platform! Very helpful and easy to use."

**Analysis:**
- Positive keywords found: "excellent", "helpful", "easy"
- Negative keywords found: 0
- Score: (3 - 0) / 3 = 1.0
- Result: **POSITIVE** ✓

**Message:** "The site is slow and confusing. Not working properly."

**Analysis:**
- Positive keywords found: 0
- Negative keywords found: "slow", "confusing", "not working"
- Score: (0 - 3) / 3 = -1.0
- Result: **NEGATIVE** ✗

## Usage

### For Admins

1. **View Sentiment Dashboard**
   - Login to admin panel
   - Navigate to Messages tab
   - See sentiment analysis at the top

2. **Interpret Graph Colors**
   - **Green bars** = Good feedback! Website performing well
   - **Gray bars** = Neutral feedback
   - **Red bars** = Issues reported, needs attention

3. **View Message Details**
   - Click any message in the list
   - Status automatically changes to "read"
   - No manual status update needed

### Understanding the Data

**High Positive Percentage (>70%)**
- ✅ Users are satisfied
- ✅ Website is performing well
- ✅ Good user experience

**High Negative Percentage (>30%)**
- ⚠️ Users facing issues
- ⚠️ Needs immediate attention
- ⚠️ Review recent changes

## Demo Data

The seeder (`npm run seed:messages`) creates:
- **45 positive messages (90%)** - with positive keywords
- **5 neutral/negative messages (10%)** - for realistic data

This results in:
- Mostly **green bars** in the graph
- High positive percentage (90%)
- Upward trend indicating good feedback

## Technical Details

### Sentiment Analysis Algorithm
```javascript
1. Convert message to lowercase
2. Search for positive keywords using regex
3. Search for negative keywords using regex
4. Calculate score: (positive - negative) / total
5. Classify:
   - score > 0.3  → positive
   - score < -0.3 → negative
   - else         → neutral
```

### Auto-Read Implementation
```javascript
// When fetching message by ID
if (message.status === 'unread') {
  message.status = 'read';
  await message.save();
}
```

### Graph Color Logic
```javascript
const positiveRatio = positive / count;
const negativeRatio = negative / count;

if (positiveRatio > 0.5) {
  color = 'green'; // Positive
} else if (negativeRatio > 0.5) {
  color = 'red'; // Negative
} else {
  color = 'gray'; // Neutral
}
```

## Benefits

### For Admins
- ✅ Quick visual feedback on user satisfaction
- ✅ Identify trends at a glance
- ✅ Prioritize negative feedback
- ✅ Track message review status automatically

### For Business
- ✅ Monitor customer satisfaction
- ✅ Identify issues early
- ✅ Data-driven decision making
- ✅ Improve user experience

## Future Enhancements

1. **Advanced NLP**: Use machine learning for better sentiment detection
2. **Sentiment Alerts**: Email notifications for negative spikes
3. **Keyword Cloud**: Visual display of most common words
4. **Response Templates**: Suggested replies based on sentiment
5. **Sentiment History**: Track sentiment changes over time
6. **Export Reports**: PDF/CSV export with sentiment data

## Testing

### Test Positive Message
```
Subject: Great Service
Message: This is an excellent platform! Very helpful and easy to use. Love it!
Expected: GREEN bar, Positive sentiment
```

### Test Negative Message
```
Subject: Issues
Message: The website is slow and confusing. Not working properly.
Expected: RED bar, Negative sentiment
```

### Test Auto-Read
```
1. Create message with status "unread"
2. Click to view message details
3. Verify status changed to "read"
```

## Troubleshooting

### Graph not showing colors
- Ensure sentiment analysis is running
- Check browser console for errors
- Verify API returns sentiment data

### Status not changing to read
- Check admin permissions
- Verify message ID is correct
- Check server logs for errors

### Sentiment seems incorrect
- Review keyword lists
- Adjust sentiment thresholds
- Consider context and sarcasm

## Notes

- Sentiment analysis is keyword-based (not AI/ML)
- Works best with clear positive/negative language
- Sarcasm and context may affect accuracy
- Auto-read only works when viewing full message details
