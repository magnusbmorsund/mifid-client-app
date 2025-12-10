# Critical Fixes - Implementation Guide

## Quick Implementation of Must-Fix Issues

This guide provides step-by-step instructions to implement the 7 critical fixes identified in the code review.

---

## Fix 1: Environment Variables for API URL

### Frontend

**Step 1**: Create `.env` file in `/frontend/`
```bash
cd frontend
touch .env
```

**Step 2**: Add to `.env`
```
REACT_APP_API_URL=http://localhost:5001/api
```

**Step 3**: Update `/frontend/src/App.js`
```javascript
// Change line 13 from:
const API_URL = 'http://localhost:5001/api';

// To:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
```

**Step 4**: Create `.env.production` for production
```
REACT_APP_API_URL=https://your-production-domain.com/api
```

**Step 5**: Add to `.gitignore`
```
# Environment files
.env
.env.local
.env.production
```

---

## Fix 2: Request Body Size Limits

### Backend

**Update `/backend/server.js` line 32**
```javascript
// Change from:
app.use(bodyParser.json());

// To:
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
```

---

## Fix 3: Input Validation

### Backend

**Step 1**: Install validation library
```bash
cd backend
npm install express-validator
```

**Step 2**: Add validation middleware to `/backend/server.js`

Add after imports:
```javascript
const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};
```

**Step 3**: Add validation to client endpoint (around line 462)
```javascript
app.post('/api/clients', [
  body('personalInfo.name').notEmpty().trim().withMessage('Name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  body('financialSituation.annualIncome').isNumeric().withMessage('Annual income must be a number'),
  body('financialSituation.netWorth').isNumeric().withMessage('Net worth must be a number'),
  body('financialSituation.investableAssets').isNumeric().withMessage('Investable assets must be a number'),
  validate
], (req, res) => {
  // ... existing code
});
```

---

## Fix 4: CORS Configuration

### Backend

**Update `/backend/server.js` line 31**
```javascript
// Change from:
app.use(cors());

// To:
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
```

**Add to `/backend/.env`**
```
FRONTEND_URL=http://localhost:3000
```

---

## Fix 5: Rate Limiting

### Backend

**Step 1**: Install rate limiting
```bash
cd backend
npm install express-rate-limit
```

**Step 2**: Add to `/backend/server.js` after imports
```javascript
const rateLimit = require('express-rate-limit');

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all API routes
app.use('/api/', apiLimiter);
```

---

## Fix 6: Require API Keys

### Backend

**Update `/backend/server.js` lines 14-23**
```javascript
// Change from:
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';
const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY || 'demo';
const EODHD_API_KEY = process.env.EODHD_API_KEY || 'demo';

// To:
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const EODHD_API_KEY = process.env.EODHD_API_KEY;

// Validate API keys on startup
if (!FINNHUB_API_KEY) {
  console.error('❌ FINNHUB_API_KEY is required. Please set it in .env file');
  process.exit(1);
}

if (!TWELVE_DATA_API_KEY) {
  console.warn('⚠️  TWELVE_DATA_API_KEY not set. Historical data features will be limited.');
}

if (!EODHD_API_KEY) {
  console.warn('⚠️  EODHD_API_KEY not set. Instrument search features will be limited.');
}
```

**Create `/backend/.env.example`**
```
# API Keys (Required)
FINNHUB_API_KEY=your_finnhub_key_here
TWELVE_DATA_API_KEY=your_twelve_data_key_here
EODHD_API_KEY=your_eodhd_key_here

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database (when implemented)
# MONGODB_URI=mongodb://localhost:27017/mifid
```

---

## Fix 7: Security Headers

### Backend

**Step 1**: Install Helmet
```bash
cd backend
npm install helmet
```

**Step 2**: Add to `/backend/server.js` after imports
```javascript
const helmet = require('helmet');

// Add security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

---

## Complete Updated server.js Structure

Here's how the beginning of your server.js should look after all fixes:

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Validate required API keys
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
if (!FINNHUB_API_KEY) {
  console.error('❌ FINNHUB_API_KEY is required');
  process.exit(1);
}

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const EODHD_API_KEY = process.env.EODHD_API_KEY;

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parser with size limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// ... rest of your code
```

---

## Testing the Fixes

### Test 1: Environment Variables
```bash
# Frontend
cd frontend
echo $REACT_APP_API_URL
npm start
# Check browser console - API calls should work
```

### Test 2: Rate Limiting
```bash
# Use a tool like Apache Bench
ab -n 150 -c 10 http://localhost:5001/api/clients
# Should see rate limit errors after 100 requests
```

### Test 3: Validation
```bash
# Send invalid data
curl -X POST http://localhost:5001/api/clients \
  -H "Content-Type: application/json" \
  -d '{"personalInfo": {"name": "", "email": "invalid"}}'
# Should return validation errors
```

### Test 4: CORS
```bash
# Try from different origin
curl -H "Origin: http://evil.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:5001/api/clients
# Should be blocked
```

---

## Installation Script

Create `install-critical-fixes.sh`:
```bash
#!/bin/bash

echo "Installing critical dependencies..."

# Backend
cd backend
npm install express-validator helmet express-rate-limit
cd ..

# Create env files
echo "Creating environment files..."
touch frontend/.env
touch backend/.env
touch backend/.env.example

echo "✅ Dependencies installed"
echo "⚠️  Please configure .env files with your API keys"
echo "📝 See .env.example for required variables"
```

Make executable:
```bash
chmod +x install-critical-fixes.sh
./install-critical-fixes.sh
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All `.env` files configured with production values
- [ ] API keys obtained and set
- [ ] CORS configured for production domain
- [ ] Rate limits adjusted for production traffic
- [ ] Security headers tested
- [ ] Input validation tested with edge cases
- [ ] Request size limits tested
- [ ] Error handling verified
- [ ] Logging configured
- [ ] Monitoring set up

---

## Summary

After implementing these fixes:

✅ **Security**: Helmet, CORS, rate limiting, input validation
✅ **Configuration**: Environment variables, no hard-coded values
✅ **Reliability**: Request limits, API key validation
✅ **Production-Ready**: Proper error handling and validation

**Estimated Time**: 2-3 hours
**Difficulty**: Medium
**Impact**: Critical for production deployment

---

**Next Steps**: After implementing these fixes, proceed with the medium and low priority optimizations from the main code review document.
