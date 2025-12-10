# MiFID II Client Profiling System - Complete Guide

**Version:** 1.0.0  
**Last Updated:** December 10, 2024  
**Reflects:** Current implementation

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [API Security](#api-security)
7. [Architecture](#architecture)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup API Security

```bash
# Automated setup
./setup-api-security.sh

# Or manual:
cd backend
node generateApiKey.js "Your Company Name"
# Copy the generated API key

cd ../frontend
cp .env.example .env
# Edit .env and add: REACT_APP_API_KEY=your_api_key
```

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:5001/
- **API Base:** http://localhost:5001/api

---

## Features

### ✅ MiFID II Compliance
- Complete client profiling per EU MiFID II regulations
- Financial situation assessment
- Knowledge & experience evaluation
- Investment objectives documentation
- Risk tolerance measurement
- Sustainability preferences (ESG)

### 📊 Risk Assessment
- Advanced risk scoring algorithm (0-100 scale)
- 7-level risk classification
- Dynamic instrument filtering
- Multi-tenant support (retail, private banking)
- Automatic risk profile calculation

### 💼 Portfolio Management
- Upload existing portfolios
- Build proposed portfolios
- Side-by-side comparison
- Allocation analysis
- Value change tracking
- JSON file storage

### 📈 Market Data Integration
- **Finnhub:** Real-time quotes (60 calls/min)
- **Twelve Data:** Historical data (800 calls/day)
- **EODHD:** Instrument universe with ISINs
- Support for stocks, bonds, ETFs, commodities, crypto

### 🔒 Security
- API key authentication
- Rate limiting (100 req/min per key)
- Usage tracking
- Key management tools
- CORS configuration
- Request size limits (10MB)

### 🎨 User Interface
- Modern, responsive design
- Step-by-step workflow
- Real-time validation
- Visual risk indicators
- Portfolio comparison view with 3 tabs
- Historical performance charts

---

## Installation

### Prerequisites
- Node.js 14+ and npm
- Git (optional)

### Step-by-Step Installation

```bash
# 1. Navigate to project
cd mifid-client-app

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Setup environment variables
cd ../backend
cp .env.example .env
# Edit .env with your API keys

cd ../frontend
cp .env.example .env
# Edit .env with backend URL and API key
```

### Required Environment Variables

**Backend** (`/backend/.env`):
```
PORT=5001
FINNHUB_API_KEY=your_finnhub_key
TWELVE_DATA_API_KEY=your_twelve_data_key
EODHD_API_KEY=your_eodhd_key
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`/frontend/.env`):
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_API_KEY=your_generated_api_key
```

---

## Configuration

### Get External API Keys

#### 1. Finnhub (Real-time quotes)
1. Visit https://finnhub.io/
2. Sign up for free account
3. Get API key from dashboard
4. Free tier: 60 calls/minute

#### 2. Twelve Data (Historical data)
1. Visit https://twelvedata.com/
2. Sign up for free account
3. Get API key from dashboard
4. Free tier: 800 calls/day

#### 3. EODHD (Instrument universe)
1. Visit https://eodhd.com/
2. Sign up for account
3. Get API key
4. Optional: Used for instrument search

### Generate Application API Key

```bash
cd backend
node generateApiKey.js "Your Company Name"
```

**Output:**
```
✅ API Key Generated Successfully!

Client Name:  Your Company Name
Client ID:    client_1733841234567_a1b2c3d4
API Key:      64characterhexadecimalkey...
Created:      2024-12-10T12:00:00.000Z

⚠️  IMPORTANT: Save this API key securely.
```

Copy the API key and add it to `frontend/.env`:
```
REACT_APP_API_KEY=64characterhexadecimalkey...
```

---

## Usage

### User Workflow

#### Step 1: Client Profiling
1. Open http://localhost:3000
2. Fill in client information:
   - Personal info (name, email, etc.)
   - Financial situation (income, assets)
   - Knowledge & experience
   - Investment objectives
   - Risk tolerance
   - Sustainability preferences
3. Click "Calculate Risk Profile"

#### Step 2: Risk Assessment & Existing Portfolio
1. View calculated risk profile
2. See risk score, level, and category
3. View allowed instruments
4. **Optional:** Upload existing portfolio
   - Manual entry or JSON import
   - Enter holdings with quantities/values
5. Click "Continue to Portfolio Builder"

#### Step 3: Build Portfolio
1. View instruments filtered by risk level
2. Select instruments to include
3. Set allocation percentages
4. Ensure total = 100%
5. Name the portfolio
6. Click "Create Portfolio"

#### Step 4: Success & Comparison
1. Portfolio created successfully
2. If existing portfolio uploaded:
   - Click "Compare with Existing Portfolio"
   - View side-by-side comparison
   - See allocation changes
   - Analyze value differences

#### Step 5: Portfolio Comparison View
Three tabs available:
- **Comparison:** Side-by-side analysis
- **Current Portfolio:** Existing holdings
- **Proposed Portfolio:** New recommendations

---

## API Security

### Authentication System

All POST endpoints require API key authentication via `X-API-Key` header.

### Generate API Key

```bash
cd backend
node generateApiKey.js "Client Name"
```

### Manage API Keys

```bash
# List all keys
node manageApiKeys.js list

# View statistics
node manageApiKeys.js stats

# Revoke a key
node manageApiKeys.js revoke [api-key]

# Activate a key
node manageApiKeys.js activate [api-key]
```

### Using API Keys

**In Frontend (.env):**
```
REACT_APP_API_KEY=your_key_here
```

**With cURL:**
```bash
curl -X POST http://localhost:5001/api/clients \
  -H "X-API-Key: your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"personalInfo": {...}}'
```

**With JavaScript:**
```javascript
axios.defaults.headers.common['X-API-Key'] = 'your_key_here';
```

### Rate Limiting

- **Limit:** 100 requests per minute per API key
- **Reset:** Automatic after 60 seconds
- **Headers:** Response includes rate limit info

### Protected Endpoints

- `POST /api/clients` - Create client
- `POST /api/clients/new` - Create minimal client
- `POST /api/clients/:id/*` - Update client sections
- `POST /api/portfolios` - Create portfolio
- `POST /api/accounts` - Create account
- `POST /api/accounts/:id/existing-portfolio` - Upload portfolio

### Public Endpoints

- `GET /api/clients` - List clients
- `GET /api/clients/:id` - Get client
- `GET /api/portfolios/:clientId` - Get portfolios
- `POST /api/instruments/filter` - Filter instruments
- `POST /api/portfolios/compare` - Compare portfolios
- `GET /api/risk-configuration` - Get risk configs

---

## Architecture

### Technology Stack

**Backend:**
- Node.js + Express
- Axios for HTTP requests
- Custom authentication middleware
- In-memory storage + JSON files
- Finnhub, Twelve Data, EODHD APIs

**Frontend:**
- React 18
- Axios for API calls
- React Hooks (useState)
- Custom CSS3
- Recharts for visualization

### Data Storage

**In-Memory:**
- `clients[]` - Client profiles
- `portfolios[]` - Portfolios
- `accounts[]` - Account structures

**File System:**
- `portfolios/*.json` - Saved portfolios
- `api-keys.json` - API keys (gitignored)

### Components

**Frontend:**
- `App.js` - Main container
- `ClientForm.js` - Client data collection
- `RiskProfile.js` - Risk assessment display
- `ExistingPortfolioUpload.js` - Upload current portfolio
- `InstrumentSelector.js` - Select instruments
- `PortfolioBuilder.js` - Build portfolio
- `PortfolioView.js` - Comparison view (3 tabs)
- `PortfolioChart.js` - Historical charts
- `PortfolioComparison.js` - Legacy comparison

**Backend:**
- `server.js` - Main Express server
- `authMiddleware.js` - Authentication logic
- `generateApiKey.js` - Key generation CLI
- `manageApiKeys.js` - Key management CLI

### API Flow

```
User → Frontend (React)
  ↓
  HTTP Request + X-API-Key header
  ↓
Backend → authMiddleware → Validate key
  ↓
  Endpoint handler
  ↓
  External APIs (if needed)
  ↓
  Response → Frontend → User
```

---

## Production Deployment

### Database Migration

**Replace in-memory storage with database:**

```javascript
// MongoDB example
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const ClientSchema = new mongoose.Schema({
  personalInfo: Object,
  financialSituation: Object,
  // ... other fields
});

const Client = mongoose.model('Client', ClientSchema);
```

### Environment Variables

**Production Backend (.env):**
```
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb://...
FINNHUB_API_KEY=production_key
TWELVE_DATA_API_KEY=production_key
EODHD_API_KEY=production_key
FRONTEND_URL=https://your-domain.com
```

**Production Frontend (.env.production):**
```
REACT_APP_API_URL=https://api.your-domain.com/api
REACT_APP_API_KEY=production_api_key
```

### Build Frontend

```bash
cd frontend
npm run build
```

Deploy the `build/` folder to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting

### Deploy Backend

Deploy to:
- Heroku
- AWS EC2/Elastic Beanstalk
- DigitalOcean
- Google Cloud Platform

### Security Checklist

- [ ] Generate production API keys
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Implement database
- [ ] Set up logging (Winston, Bunyan)
- [ ] Add monitoring (New Relic, Datadog)
- [ ] Backup `api-keys.json` regularly
- [ ] Rotate API keys every 90 days
- [ ] Review rate limits
- [ ] Set up error tracking (Sentry)

---

## Troubleshooting

### Backend Won't Start

**Error:** `Port 5001 already in use`
```bash
# Kill process on port
lsof -ti:5001 | xargs kill -9

# Or change port in .env
PORT=5002
```

**Error:** `FINNHUB_API_KEY is required`
```bash
# Add API key to backend/.env
FINNHUB_API_KEY=your_key_here
```

### Frontend Can't Connect

**Error:** `Network Error`
```bash
# 1. Check backend is running
curl http://localhost:5001/api/clients

# 2. Check .env file exists
cat frontend/.env

# 3. Verify API key
cd backend
node manageApiKeys.js list
```

**Error:** `CORS error`
```bash
# Check FRONTEND_URL in backend/.env
FRONTEND_URL=http://localhost:3000
```

### Authentication Errors

**Error:** `Authentication required`
- Add API key to `frontend/.env`
- Restart frontend after adding key

**Error:** `Invalid API key`
```bash
# Generate new key
cd backend
node generateApiKey.js "Your Name"

# Update frontend/.env
REACT_APP_API_KEY=new_key_here
```

**Error:** `API key revoked`
```bash
# Activate key
node manageApiKeys.js activate [key]

# Or generate new key
node generateApiKey.js "Your Name"
```

### Rate Limit Errors

**Error:** `Rate limit exceeded`
- Wait 60 seconds for reset
- Or generate new API key
- Check usage: `node manageApiKeys.js stats`

### Portfolio Comparison Not Working

**Issue:** No comparison button
- Upload existing portfolio in Step 2
- Create proposed portfolio in Step 3
- Both must exist for comparison

**Issue:** Comparison shows no data
- Verify both portfolio IDs are valid
- Check portfolios belong to same client
- Check backend logs for errors

### External API Errors

**Error:** `Finnhub API error`
- Check API key is valid
- Verify rate limit not exceeded (60/min)
- Check internet connection

**Error:** `Twelve Data API error`
- Check API key is valid
- Verify daily limit not exceeded (800/day)
- Try different time range

---

## Command Reference

### Backend Commands

```bash
# Start server
npm start

# Generate API key
node generateApiKey.js "Client Name"

# List API keys
node manageApiKeys.js list

# View statistics
node manageApiKeys.js stats

# Revoke key
node manageApiKeys.js revoke [key]

# Activate key
node manageApiKeys.js activate [key]
```

### Frontend Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Setup Commands

```bash
# Automated security setup
./setup-api-security.sh

# Install all dependencies
npm install
```

---

## Additional Resources

### Documentation Files
- `GUIDE.md` - This complete guide
- `ARCHITECTURE.md` - System architecture
- `API_REFERENCE.md` - Complete API documentation
- `API_SECURITY_SETUP.md` - Security setup guide
- `README.md` - Project overview
- `DOCS.md` - Documentation index

### Web Interfaces
- **Frontend App:** http://localhost:3000
- **API Documentation:** http://localhost:5001/
- **API Base URL:** http://localhost:5001/api

### Support
For issues or questions:
1. Check this guide
2. Review architecture documentation
3. Check API reference
4. Review code comments

---

## Version History

### v1.0.0 (December 10, 2024)
- ✅ Complete MiFID II client profiling
- ✅ Risk assessment engine
- ✅ Portfolio management
- ✅ Portfolio comparison view (3 tabs)
- ✅ API key authentication
- ✅ Rate limiting
- ✅ Multi-tenant support
- ✅ Market data integration (Finnhub, Twelve Data, EODHD)
- ✅ Existing portfolio upload
- ✅ Side-by-side portfolio comparison

---

**Last Updated:** December 10, 2024  
**Version:** 1.0.0  
**Status:** Production Ready (with database migration)
