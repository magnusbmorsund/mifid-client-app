# Portfolio Comparison - Quick Start Guide

## 🚀 New Feature: Compare Existing vs. Proposed Portfolios

Your MiFID II Client Profiling System now includes the ability to upload a client's existing portfolio and compare it with your proposed recommendations.

## Quick Start (5 Minutes)

### 1. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

The app will open at `http://localhost:3000`

### 2. Complete Client Profile

- Fill out the client information form
- Complete the risk assessment
- View the risk profile

### 3. Upload Existing Portfolio

On the Risk Profile page, scroll down to see **"Upload Existing Portfolio"**

**Option A: Manual Entry**
1. Click "Manual Entry" tab
2. Enter portfolio name (e.g., "Current Holdings")
3. Add holdings:
   - Symbol: AAPL
   - Quantity: 100
   - Current Value: 17500
   - Type: Stocks
4. Click "+ Add Holding" for more
5. Click "Upload Portfolio"

**Option B: JSON Upload**
1. Click "JSON Upload" tab
2. Paste this example:
```json
{
  "name": "Current Holdings",
  "holdings": [
    {
      "symbol": "AAPL",
      "quantity": 100,
      "currentValue": 17500,
      "type": "stocks"
    },
    {
      "symbol": "MSFT",
      "quantity": 50,
      "currentValue": 18500,
      "type": "stocks"
    }
  ]
}
```
3. Click "Upload JSON Portfolio"

### 4. Build Proposed Portfolio

1. Click "Continue to Portfolio Builder"
2. Select instruments from the filtered list
3. Allocate percentages (must total 100%)
4. Enter portfolio name
5. Click "Create Portfolio"

### 5. View Comparison

After creating the portfolio:
- You'll be prompted to compare portfolios
- Click "Yes" to see the comparison
- Or click "Compare with Existing Portfolio" from the success screen

## What You'll See in the Comparison

### Summary Cards
- **Existing Portfolio**: Current holdings and total value
- **Proposed Portfolio**: New recommendations and total value
- **Arrow**: Visual indicator of the transition

### Key Differences
- **Value Change**: Dollar amount and percentage change
- **Holdings Change**: Number of securities added/removed
- **Added Holdings**: New securities in proposed portfolio
- **Removed Holdings**: Securities to sell from existing portfolio

### Holdings Analysis
- **Added Holdings**: Complete list with allocations
- **Removed Holdings**: Complete list with current values
- **Allocation Changes**: How existing holdings' percentages change

### Detailed Comparison
Side-by-side view of all holdings in both portfolios

## API Testing

Test the backend directly:

```bash
# Make the test script executable (already done)
chmod +x test-account-features.sh

# Run the test
./test-account-features.sh
```

This will:
1. Create a test account
2. Upload an existing portfolio
3. Create a proposed portfolio
4. Compare them
5. Show you the results

## Example Use Case

**Client Scenario**: Tech-heavy portfolio needs diversification

**Existing Portfolio**:
- 100 shares AAPL @ $175 = $17,500 (48.6%)
- 50 shares MSFT @ $370 = $18,500 (51.4%)
- **Total**: $36,000

**Proposed Portfolio** (based on Moderate risk profile):
- 20% AAPL = $10,000
- 20% MSFT = $10,000
- 30% SPY (S&P 500 ETF) = $15,000
- 30% BND (Bond ETF) = $15,000
- **Total**: $50,000

**Comparison Shows**:
- Value increase: +$14,000 (38.89%)
- AAPL allocation: 48.6% → 20% (-28.6%)
- MSFT allocation: 51.4% → 20% (-31.4%)
- Added: SPY, BND (diversification)
- Better risk-adjusted portfolio

## File Locations

### Portfolios Saved To
```
mifid-client-app/
└── portfolios/
    ├── portfolio_existing_[timestamp].json  (existing portfolios)
    └── portfolio_[timestamp].json           (proposed portfolios)
```

### View Saved Portfolios
```bash
# List all portfolios
ls -la portfolios/

# View a specific portfolio
cat portfolios/portfolio_existing_*.json | jq '.'
```

## Troubleshooting

### Backend Not Starting
```bash
cd backend
npm install
npm start
```

### Frontend Not Starting
```bash
cd frontend
npm install
npm start
```

### Port Already in Use
- Backend uses port 5001
- Frontend uses port 3000
- Kill existing processes or change ports in `.env` files

### Comparison Not Showing
- Ensure you uploaded an existing portfolio BEFORE creating the proposed one
- Check browser console for errors (F12)
- Verify both portfolios exist in `/portfolios` directory

## Advanced Features

### Multiple Portfolios
You can upload multiple existing portfolios for the same client and compare any combination.

### JSON Format Details
```json
{
  "name": "Portfolio Name",
  "holdings": [
    {
      "symbol": "AAPL",           // Required: Ticker symbol
      "name": "Apple Inc.",       // Optional: Full name
      "quantity": 100,            // Required: Number of shares
      "currentValue": 17500,      // Required: Current market value
      "purchasePrice": 150,       // Optional: Original purchase price
      "purchaseDate": "2023-01-15", // Optional: Purchase date
      "type": "stocks"            // Optional: Asset type
    }
  ]
}
```

### Supported Asset Types
- `stocks` - Individual stocks
- `bonds` - Bonds
- `etfs` - Exchange-Traded Funds
- `mutual_funds` - Mutual Funds
- `commodities` - Commodities
- `crypto` - Cryptocurrencies
- `other` - Other asset types

## Next Steps

1. **Try it out**: Follow the Quick Start above
2. **Read the full guide**: See [ACCOUNT_PORTFOLIO_GUIDE.md](./ACCOUNT_PORTFOLIO_GUIDE.md)
3. **Review API docs**: Check [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
4. **Customize**: Modify the comparison logic in `backend/server.js`

## Support

For detailed documentation:
- **Full API Reference**: [ACCOUNT_PORTFOLIO_GUIDE.md](./ACCOUNT_PORTFOLIO_GUIDE.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Main README**: [README.md](./README.md)

---

**Happy Portfolio Comparing! 📊**
