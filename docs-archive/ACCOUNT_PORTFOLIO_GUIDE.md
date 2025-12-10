# Account Structures & Portfolio Comparison Guide

## Overview

The MiFID II Client Profiling System now includes comprehensive account structures that allow clients to upload their existing portfolio holdings and compare them with proposed portfolios. This enables advisors to show clients exactly how their portfolio would change with the new recommendations.

## Features

### 1. Account Structure
- Each client has an associated account that tracks:
  - **Existing Portfolios**: Current holdings uploaded by the client
  - **Proposed Portfolios**: New portfolio recommendations created by the advisor
- Accounts automatically link portfolios to clients
- All data is stored both in-memory and as JSON files

### 2. Existing Portfolio Upload
- **Manual Entry**: Add holdings one by one with a user-friendly form
- **JSON Upload**: Bulk upload portfolios using JSON format
- Required fields per holding:
  - Symbol (e.g., AAPL, MSFT)
  - Quantity
  - Current Value
  - Optional: Name, Type, Purchase Price, Purchase Date

### 3. Portfolio Comparison
- Side-by-side comparison of existing vs. proposed portfolios
- **Key Metrics**:
  - Total value change (absolute and percentage)
  - Number of holdings change
  - Added holdings
  - Removed holdings
  - Allocation changes for common holdings
- **Detailed Analysis**:
  - Holdings added to the portfolio
  - Holdings removed from the portfolio
  - Allocation adjustments for existing holdings
  - Complete holdings breakdown for both portfolios

## API Endpoints

### Account Management

#### Create/Get Account
```http
POST /api/accounts
Content-Type: application/json

{
  "clientId": "1234567890"
}
```

**Response:**
```json
{
  "id": "1234567890",
  "clientId": "1234567890",
  "existingPortfolios": [],
  "proposedPortfolios": [],
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-10T12:00:00.000Z"
}
```

#### Get Account with Portfolios
```http
GET /api/accounts/:clientId
```

**Response:**
```json
{
  "id": "1234567890",
  "clientId": "1234567890",
  "existingPortfolios": [
    {
      "id": "1234567891",
      "name": "Current Holdings",
      "type": "existing",
      "totalValue": 50000,
      "holdings": [...]
    }
  ],
  "proposedPortfolios": [
    {
      "id": "1234567892",
      "name": "Balanced Growth Portfolio",
      "type": "proposed",
      "totalValue": 50000,
      "holdings": [...]
    }
  ]
}
```

### Portfolio Upload

#### Upload Existing Portfolio
```http
POST /api/accounts/:clientId/existing-portfolio
Content-Type: application/json

{
  "name": "Current Holdings",
  "holdings": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "quantity": 100,
      "currentValue": 17500,
      "purchasePrice": 150,
      "purchaseDate": "2023-01-15",
      "type": "stocks"
    },
    {
      "symbol": "MSFT",
      "name": "Microsoft Corporation",
      "quantity": 50,
      "currentValue": 18500,
      "type": "stocks"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Existing portfolio uploaded successfully",
  "portfolio": {
    "id": "1234567891",
    "clientId": "1234567890",
    "name": "Current Holdings",
    "type": "existing",
    "totalValue": 36000,
    "holdings": [...],
    "createdAt": "2024-01-10T12:00:00.000Z"
  },
  "savedToFile": "portfolio_existing_1234567891.json"
}
```

### Portfolio Comparison

#### Compare Two Portfolios
```http
POST /api/portfolios/compare
Content-Type: application/json

{
  "existingPortfolioId": "1234567891",
  "proposedPortfolioId": "1234567892"
}
```

**Response:**
```json
{
  "existing": {
    "id": "1234567891",
    "name": "Current Holdings",
    "totalValue": 36000,
    "holdingsCount": 2
  },
  "proposed": {
    "id": "1234567892",
    "name": "Balanced Growth Portfolio",
    "totalValue": 50000,
    "holdingsCount": 5
  },
  "differences": {
    "valueChange": 14000,
    "valueChangePercent": "38.89",
    "holdingsCountChange": 3
  },
  "holdingsAnalysis": {
    "added": [...],
    "removed": [...],
    "common": [...],
    "addedCount": 4,
    "removedCount": 1,
    "commonCount": 1
  },
  "allocationChanges": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "existingAllocation": "48.61",
      "proposedAllocation": "20.00",
      "allocationChange": "-28.61"
    }
  ]
}
```

## Usage Flow

### 1. Client Profiling
1. Complete client profile (Step 1)
2. View risk assessment (Step 2)

### 2. Upload Existing Portfolio (Optional)
At Step 2, you can optionally upload the client's existing portfolio:

**Manual Entry:**
- Click "Manual Entry" tab
- Enter portfolio name
- Add holdings one by one
- Fill in Symbol, Quantity, Current Value
- Click "Upload Portfolio"

**JSON Upload:**
- Click "JSON Upload" tab
- Paste JSON data following the example format
- Click "Upload JSON Portfolio"

### 3. Build Proposed Portfolio
1. Continue to Portfolio Builder (Step 3)
2. Select instruments based on risk profile
3. Allocate percentages
4. Create portfolio

### 4. Compare Portfolios
If an existing portfolio was uploaded:
- After creating the proposed portfolio, you'll be prompted to compare
- Click "Compare with Existing Portfolio"
- View detailed comparison showing:
  - Value changes
  - Holdings added/removed
  - Allocation adjustments
  - Side-by-side holdings breakdown

## JSON Format for Bulk Upload

```json
{
  "name": "My Current Portfolio",
  "holdings": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "quantity": 100,
      "currentValue": 17500,
      "purchasePrice": 150,
      "purchaseDate": "2023-01-15",
      "type": "stocks"
    },
    {
      "symbol": "MSFT",
      "name": "Microsoft Corporation",
      "quantity": 50,
      "currentValue": 18500,
      "type": "stocks"
    },
    {
      "symbol": "SPY",
      "name": "SPDR S&P 500 ETF",
      "quantity": 25,
      "currentValue": 11250,
      "type": "etfs"
    }
  ]
}
```

### Required Fields
- `name`: Portfolio name
- `holdings`: Array of holdings
  - `symbol`: Ticker symbol (required)
  - `quantity`: Number of shares/units (required)
  - `currentValue`: Current market value in USD (required)

### Optional Fields
- `name`: Full name of the security
- `purchasePrice`: Original purchase price per share
- `purchaseDate`: Date of purchase (ISO format)
- `type`: Asset type (stocks, bonds, etfs, mutual_funds, commodities, crypto, other)

## Data Storage

### Portfolio Files
All portfolios are saved as JSON files in the `/portfolios` directory:
- **Existing portfolios**: `portfolio_existing_[id].json`
- **Proposed portfolios**: `portfolio_[id].json`

### Account Structure
Accounts are stored in-memory with the following structure:
```javascript
{
  id: "unique_id",
  clientId: "client_id",
  existingPortfolios: ["portfolio_id_1", "portfolio_id_2"],
  proposedPortfolios: ["portfolio_id_3"],
  createdAt: "ISO_timestamp",
  updatedAt: "ISO_timestamp"
}
```

## Integration with Existing System

The account structure seamlessly integrates with the existing MiFID II workflow:

1. **Client Creation**: Accounts are automatically created when portfolios are uploaded or created
2. **Portfolio Creation**: Proposed portfolios automatically link to the client's account
3. **Risk Profile**: Comparison respects the client's risk profile and MiFID II compliance
4. **Multi-Tenant**: Works with both retail and private banking configurations

## Benefits

### For Advisors
- Clear visualization of portfolio changes
- Easy identification of holdings to add/remove
- Allocation adjustment recommendations
- Professional presentation for client meetings

### For Clients
- Transparent view of proposed changes
- Understanding of how their portfolio will evolve
- Confidence in advisor recommendations
- Clear documentation of current vs. proposed holdings

## Example Use Case

**Scenario**: Client has a concentrated portfolio in tech stocks and wants to diversify.

1. **Upload existing portfolio**:
   - 100 shares AAPL ($17,500)
   - 50 shares MSFT ($18,500)
   - Total: $36,000

2. **Create proposed portfolio** based on risk profile:
   - 20% AAPL ($10,000)
   - 20% MSFT ($10,000)
   - 20% SPY ($10,000)
   - 20% BND ($10,000)
   - 20% GLD ($10,000)
   - Total: $50,000

3. **Comparison shows**:
   - Value increase: +$14,000 (38.89%)
   - AAPL allocation: 48.61% → 20% (-28.61%)
   - MSFT allocation: 51.39% → 20% (-31.39%)
   - Added: SPY, BND, GLD
   - Better diversification across asset classes

## Testing the Feature

### Test with Manual Entry
1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm start`
3. Complete client profile
4. At Step 2, use "Manual Entry" to add 2-3 holdings
5. Continue to create a proposed portfolio
6. Compare the portfolios

### Test with JSON Upload
Use this sample JSON:
```json
{
  "name": "Test Portfolio",
  "holdings": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "quantity": 50,
      "currentValue": 8750,
      "type": "stocks"
    },
    {
      "symbol": "GOOGL",
      "name": "Alphabet Inc.",
      "quantity": 30,
      "currentValue": 4200,
      "type": "stocks"
    }
  ]
}
```

## Future Enhancements

Potential improvements for the account structure:
- Historical portfolio tracking
- Performance analytics over time
- Tax implications of portfolio changes
- Transaction cost estimation
- Rebalancing recommendations
- Multiple existing portfolios per client
- Portfolio consolidation suggestions
- ESG impact comparison

---

**Note**: This feature maintains full MiFID II compliance by ensuring all portfolio recommendations align with the client's risk profile and investment objectives.
