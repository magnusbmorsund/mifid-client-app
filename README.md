# MiFID II Client Profiling System

A comprehensive, MiFID II-compliant investment advisory platform for profiling clients, assessing risk tolerance, and building suitable investment portfolios with real-time market data.

📚 **[Complete Guide](./GUIDE.md)** | 🔒 **[API Security](./API_SECURITY_SETUP.md)** | 🌐 **[API Reference](./API_REFERENCE.md)** | 🏗️ **[Architecture](./ARCHITECTURE.md)** | 📋 **[Docs Index](./DOCS.md)**

## Features

### ✅ MiFID II Compliance
- Comprehensive client profiling according to EU MiFID II regulations
- Financial situation assessment
- Knowledge and experience evaluation
- Sustainability preference tracking (ESG)
- Risk tolerance measurement
- Investment objective documentation

### 📊 Risk Assessment
- Advanced risk scoring algorithm (0-100 scale)
- 7-level risk classification (Very Low to Very High)
- Dynamic instrument filtering based on risk profile
- Factor-based assessment with transparent scoring

### 💼 Portfolio Management
- Real-time instrument data from Twelve Data API
- Historical return charts (aggregated & individual instruments)
- Smart filtering based on risk profile
- Portfolio allocation builder with visual feedback
- JSON file storage for portfolios
- Support for multiple asset classes:
  - Stocks (including Oslo Børs)
  - Bonds
  - ETFs
  - Mutual Funds
  - Commodities
  - Cryptocurrencies
  - Options & Futures (for high-risk profiles)

### 🎨 Professional UI/UX
- Modern, distinctive design
- Responsive layout for all devices
- Step-by-step workflow
- Real-time validation
- Visual risk indicators

## Technology Stack

**Backend:**
- Node.js + Express
- Twelve Data API integration
- RESTful API architecture
- JSON file storage for portfolios
- In-memory client storage (easily upgradable to database)

**Frontend:**
- React 18
- Recharts for data visualization
- Axios for API calls
- Custom CSS with modern design
- No external UI frameworks (pure React)

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm

### 1. Clone and Setup Backend

```bash
cd mifid-client-app/backend
npm install
```

### 2. Configure Twelve Data API

**Get your free API key:**
1. Visit https://twelvedata.com/
2. Sign up for a free account (free tier: 800 calls/day, 8 symbols per request)
3. Get your API key from the dashboard

**Create `.env` file in backend folder:**
```bash
cd backend
cp .env.example .env
```

**Edit `.env` and add your API key:**
```
PORT=5001
TWELVE_DATA_API_KEY=your_actual_api_key_here
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### 4. Start Backend Server

```bash
cd ../backend
npm start
```

Backend will run on `http://localhost:5001`

### 5. Start Frontend (in new terminal)

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

The app will automatically open in your browser.

## Adding Custom Input Fields

The system is designed to be easily extensible. Here's how to add new fields:

### Example: Adding "Employment Status" to Financial Situation

#### 1. Update Backend Risk Calculation

Edit `backend/server.js`:

```javascript
// Add to calculateRiskProfile function
const employmentStatus = clientData.financialSituation.employmentStatus;

if (employmentStatus === 'employed_full_time') {
  riskScore += 5;
  factors.push('Stable employment');
} else if (employmentStatus === 'self_employed') {
  riskScore += 3;
} else if (employmentStatus === 'retired') {
  riskScore += 2;
}
```

#### 2. Update Frontend Form

Edit `frontend/src/components/ClientForm.js`:

```javascript
// Add to initial state
financialSituation: {
  // ... existing fields
  employmentStatus: 'employed_full_time'
}

// Add to form JSX in Financial Situation section
<div className="form-group">
  <label>Employment Status *</label>
  <select
    required
    value={formData.financialSituation.employmentStatus}
    onChange={(e) => handleChange('financialSituation', 'employmentStatus', e.target.value)}
  >
    <option value="employed_full_time">Employed Full-Time</option>
    <option value="employed_part_time">Employed Part-Time</option>
    <option value="self_employed">Self-Employed</option>
    <option value="retired">Retired</option>
    <option value="unemployed">Unemployed</option>
  </select>
</div>
```

#### 3. Display in Risk Profile

Edit `frontend/src/components/RiskProfile.js`:

```javascript
// Add to financial grid
<div className="financial-item">
  <span className="financial-label">Employment</span>
  <span className="financial-value">
    {clientData.financialSituation.employmentStatus.replace(/_/g, ' ')}
  </span>
</div>
```

### Adding New Sections

To add a completely new section (e.g., "Tax Situation"):

1. **Backend**: Create new assessment logic in `calculateRiskProfile()`
2. **Frontend Form**: Add new section with `<div className="form-section">`
3. **Frontend Display**: Add new section in `RiskProfile.js`

## Customizing Risk Assessment

The risk assessment algorithm is in `backend/server.js` in the `calculateRiskProfile()` function.

### Risk Score Breakdown:
- Financial Situation: 0-30 points
- Knowledge & Experience: 0-35 points
- Investment Objectives: 0-20 points
- Risk Tolerance: 0-15 points

### Risk Levels (customize thresholds as needed):
```javascript
if (riskScore >= 85) riskLevel = 7; // Very High
if (riskScore >= 70) riskLevel = 6; // High
if (riskScore >= 55) riskLevel = 5; // Moderate-High
if (riskScore >= 40) riskLevel = 4; // Moderate
if (riskScore >= 25) riskLevel = 3; // Low-Moderate
if (riskScore >= 15) riskLevel = 2; // Low
else riskLevel = 1; // Very Low
```

## Expanding Investment Instruments

### Adding More Instruments

Edit `backend/server.js` in the `POST /api/instruments/filter` endpoint:

```javascript
const instrumentUniverse = {
  stocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 
           'EQNR.OL', 'DNB.OL', 'YAR.OL', 'MOWI.OL'], // Add more Oslo Børs stocks
  bonds: ['TLT', 'AGG', 'BND', 'LQD', 'HYG'],
  etfs: ['SPY', 'VOO', 'VTI', 'QQQ', 'IWM', 'EFA', 'VEA', 'VWO'],
  commodities: ['GLD', 'SLV', 'USO', 'DBC'],
  crypto: ['BTC-USD', 'ETH-USD', 'BNB-USD', 'ADA-USD'],
  // Add new categories
  real_estate: ['VNQ', 'IYR', 'REIT'],
  international: ['EFA', 'VEA', 'IEMG']
};
```

### Adding ESG Filtering

To implement real ESG filtering, integrate with ESG data providers:

```javascript
// Example: Filter by ESG score
const esgMinScore = sustainabilityPreferences?.esgMinRating;
if (esgMinScore) {
  filteredInstruments = instruments.filter(inst => {
    // Call ESG API to get score
    const esgScore = await getESGScore(inst.symbol);
    return esgScore >= esgMinScore;
  });
}
```

## Database Integration

Currently uses in-memory storage. To add database persistence:

### Using MongoDB:

```bash
npm install mongodb mongoose
```

Create `backend/models/Client.js`:

```javascript
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  personalInfo: Object,
  financialSituation: Object,
  knowledgeExperience: Object,
  objectives: Object,
  riskTolerance: Object,
  sustainability: Object,
  riskProfile: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', clientSchema);
```

Update `server.js`:

```javascript
const mongoose = require('mongoose');
const Client = require('./models/Client');

mongoose.connect('mongodb://localhost:27017/mifid-clients');

// Replace in-memory storage with database queries
app.post('/api/clients', async (req, res) => {
  const client = new Client(req.body);
  await client.save();
  res.json(client);
});
```

## API Endpoints

### POST `/api/clients`
Create/update client profile and calculate risk assessment
- Body: Client data object
- Returns: Client with calculated risk profile

### GET `/api/clients`
Get all clients
- Returns: Array of clients

### GET `/api/clients/:id`
Get specific client
- Returns: Client object

### POST `/api/instruments/filter`
Get investment instruments filtered by risk profile
- Body: `{ riskLevel, allowedInstruments, sustainabilityPreferences }`
- Returns: Array of instruments with real-time pricing

### POST `/api/portfolios`
Create portfolio and save as JSON file
- Body: `{ clientId, clientName, name, holdings, totalValue, amountForAdvice }`
- Returns: Created portfolio with savedToFile property

### GET `/api/portfolios/:clientId`
Get portfolios for a client
- Returns: Array of portfolios

### POST `/api/instruments/historical`
Get historical price data for instruments
- Body: `{ symbols: ['AAPL', 'MSFT'], range: '1y' }`
- Range options: '1mo', '3mo', '6mo', '1y', '5y'
- Returns: Normalized historical returns for each symbol

## Customizing the UI

The CSS is in `frontend/src/styles/App.css`. Key variables are at the top:

```css
:root {
  --primary: #2563eb;        /* Main brand color */
  --primary-dark: #1e40af;   /* Hover states */
  --success: #22c55e;        /* Success indicators */
  --warning: #f97316;        /* Warnings */
  --danger: #ef4444;         /* Errors */
  /* ... more variables */
}
```

Change these to match your brand.

## Production Deployment

### Environment Variables

Create `.env` files:

**Backend (.env):**
```
PORT=5000
NODE_ENV=production
DATABASE_URL=your_database_url
```

**Frontend (.env):**
```
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Build Frontend

```bash
cd frontend
npm run build
```

Serve the `build` folder with your preferred hosting (Netlify, Vercel, AWS S3, etc.)

### Deploy Backend

Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)

## MiFID II Compliance Notes

This system implements the following MiFID II requirements:

1. **Appropriateness Assessment** (Art. 25(2))
   - Knowledge and experience questionnaire
   - Investment instrument familiarity

2. **Suitability Assessment** (Art. 25(2))
   - Financial situation
   - Investment objectives
   - Risk tolerance
   - Sustainability preferences (from August 2022)

3. **Sustainability Preferences** (SFDR)
   - ESG importance rating
   - Sector exclusions
   - Preferred sustainable sectors

**Important**: This is a technical implementation. Always consult with legal/compliance professionals to ensure full regulatory compliance.

## License

MIT License - Feel free to use and modify for your needs.

## Support

For questions or issues, please refer to the code comments or create an issue in your repository.

---

Built with ❤️ for investment advisors and asset managers
