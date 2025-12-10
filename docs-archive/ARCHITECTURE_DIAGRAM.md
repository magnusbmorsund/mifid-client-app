# Account & Portfolio Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: ClientForm                                             │
│  ↓                                                               │
│  Step 2: RiskProfile + ExistingPortfolioUpload                  │
│  ↓                                                               │
│  Step 3: InstrumentSelector + PortfolioBuilder                  │
│  ↓                                                               │
│  Step 4: Success Screen                                         │
│  ↓                                                               │
│  Step 5: PortfolioComparison (if existing portfolio exists)     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API Endpoints:                                                 │
│  ├─ POST   /api/clients                                         │
│  ├─ GET    /api/clients/:id                                     │
│  ├─ POST   /api/accounts                                        │
│  ├─ GET    /api/accounts/:clientId                              │
│  ├─ POST   /api/accounts/:clientId/existing-portfolio           │
│  ├─ POST   /api/portfolios                                      │
│  ├─ GET    /api/portfolios/:clientId                            │
│  └─ POST   /api/portfolios/compare                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  In-Memory:                                                     │
│  ├─ clients[]        - Client profiles                          │
│  ├─ portfolios[]     - All portfolios                           │
│  └─ accounts[]       - Account structures                       │
│                                                                  │
│  File System:                                                   │
│  └─ /portfolios/                                                │
│      ├─ portfolio_[id].json              (proposed)             │
│      └─ portfolio_existing_[id].json     (existing)             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Portfolio Comparison

```
┌──────────────────┐
│  Client Profile  │
│   (Step 1)       │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Risk Assessment │
│   (Step 2)       │
└────────┬─────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
         ↓                                 ↓
┌──────────────────┐            ┌──────────────────┐
│ Upload Existing  │            │  Skip Upload     │
│   Portfolio      │            │  (Optional)      │
└────────┬─────────┘            └────────┬─────────┘
         │                                │
         ↓                                │
┌──────────────────┐                     │
│  Create Account  │                     │
│  + Save Portfolio│                     │
└────────┬─────────┘                     │
         │                                │
         └────────────┬───────────────────┘
                      │
                      ↓
         ┌──────────────────┐
         │ Build Proposed   │
         │   Portfolio      │
         │   (Step 3)       │
         └────────┬─────────┘
                  │
                  ↓
         ┌──────────────────┐
         │  Save Proposed   │
         │   Portfolio      │
         │ + Link to Account│
         └────────┬─────────┘
                  │
                  ↓
         ┌──────────────────┐
         │  Existing        │────Yes────┐
         │  Portfolio?      │           │
         └────────┬─────────┘           │
                  │                     │
                  No                    ↓
                  │            ┌──────────────────┐
                  │            │  Show Comparison │
                  │            │     Option       │
                  │            │   (Step 5)       │
                  │            └──────────────────┘
                  │
                  ↓
         ┌──────────────────┐
         │  Success Screen  │
         │   (Step 4)       │
         └──────────────────┘
```

## Account Structure

```
Account {
  id: "unique_account_id"
  clientId: "client_id"
  existingPortfolios: [
    "portfolio_existing_1234567890",
    "portfolio_existing_1234567891"
  ]
  proposedPortfolios: [
    "portfolio_1234567892",
    "portfolio_1234567893"
  ]
  createdAt: "2024-01-10T12:00:00.000Z"
  updatedAt: "2024-01-10T12:00:00.000Z"
}
```

## Portfolio Structure

### Existing Portfolio
```
Portfolio {
  id: "portfolio_existing_1234567890"
  clientId: "client_id"
  name: "Current Holdings"
  type: "existing"
  holdings: [
    {
      symbol: "AAPL"
      name: "Apple Inc."
      quantity: 100
      currentValue: 17500
      purchasePrice: 150
      purchaseDate: "2023-01-15"
      type: "stocks"
    }
  ]
  totalValue: 17500
  createdAt: "2024-01-10T12:00:00.000Z"
}
```

### Proposed Portfolio
```
Portfolio {
  id: "portfolio_1234567892"
  clientId: "client_id"
  name: "Balanced Growth Portfolio"
  type: "proposed"
  holdings: [
    {
      symbol: "AAPL"
      name: "Apple Inc."
      allocation: 20
      price: 175
      type: "stocks"
    }
  ]
  totalValue: 50000
  amountForAdvice: 50000
  createdAt: "2024-01-10T12:00:00.000Z"
}
```

## Comparison Output Structure

```
Comparison {
  existing: {
    id: "portfolio_existing_1234567890"
    name: "Current Holdings"
    totalValue: 36000
    holdings: [...]
    holdingsCount: 2
  }
  proposed: {
    id: "portfolio_1234567892"
    name: "Balanced Growth Portfolio"
    totalValue: 50000
    holdings: [...]
    holdingsCount: 5
  }
  differences: {
    valueChange: 14000
    valueChangePercent: "38.89"
    holdingsCountChange: 3
  }
  holdingsAnalysis: {
    added: [...]          // Holdings in proposed but not in existing
    removed: [...]        // Holdings in existing but not in proposed
    common: [...]         // Holdings in both portfolios
    addedCount: 4
    removedCount: 1
    commonCount: 1
  }
  allocationChanges: [
    {
      symbol: "AAPL"
      name: "Apple Inc."
      existingAllocation: "48.61"
      proposedAllocation: "20.00"
      allocationChange: "-28.61"
    }
  ]
}
```

## Component Hierarchy

```
App
├── ClientForm
├── RiskProfile
│   └── ExistingPortfolioUpload
│       ├── Manual Entry Form
│       └── JSON Upload Form
├── InstrumentSelector
├── PortfolioBuilder
│   └── PortfolioChart
└── PortfolioComparison
    ├── Summary Cards
    ├── Key Differences
    ├── Holdings Analysis
    │   ├── Added Holdings Table
    │   ├── Removed Holdings Table
    │   └── Allocation Changes Table
    └── Detailed Comparison
        ├── Existing Portfolio Table
        └── Proposed Portfolio Table
```

## API Request/Response Flow

### Upload Existing Portfolio

```
Request:
POST /api/accounts/:clientId/existing-portfolio
{
  "name": "Current Holdings",
  "holdings": [
    {
      "symbol": "AAPL",
      "quantity": 100,
      "currentValue": 17500,
      "type": "stocks"
    }
  ]
}

↓

Backend Processing:
1. Validate holdings structure
2. Calculate total value
3. Create portfolio object
4. Save to portfolios array
5. Save to JSON file
6. Create/update account
7. Link portfolio to account

↓

Response:
{
  "message": "Existing portfolio uploaded successfully",
  "portfolio": {
    "id": "1234567890",
    "clientId": "client_id",
    "name": "Current Holdings",
    "type": "existing",
    "totalValue": 17500,
    "holdings": [...],
    "createdAt": "2024-01-10T12:00:00.000Z"
  },
  "savedToFile": "portfolio_existing_1234567890.json"
}
```

### Compare Portfolios

```
Request:
POST /api/portfolios/compare
{
  "existingPortfolioId": "1234567890",
  "proposedPortfolioId": "1234567891"
}

↓

Backend Processing:
1. Fetch both portfolios
2. Calculate value differences
3. Analyze holdings (added/removed/common)
4. Calculate allocation changes
5. Build comparison object

↓

Response:
{
  "existing": {...},
  "proposed": {...},
  "differences": {...},
  "holdingsAnalysis": {...},
  "allocationChanges": [...]
}
```

## State Management (React)

```
App State:
├── step                    (current workflow step)
├── clientData              (client profile)
├── riskProfile             (risk assessment)
├── availableInstruments    (filtered instruments)
├── selectedInstruments     (selected for portfolio)
├── existingPortfolio       (uploaded existing portfolio)
├── proposedPortfolio       (created proposed portfolio)
└── showComparison          (comparison view flag)
```

## File System Structure

```
mifid-client-app/
├── backend/
│   ├── server.js                    (API endpoints + logic)
│   ├── config.js                    (configuration)
│   └── package.json
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ClientForm.js
│       │   ├── RiskProfile.js
│       │   ├── InstrumentSelector.js
│       │   ├── PortfolioBuilder.js
│       │   ├── PortfolioChart.js
│       │   ├── ExistingPortfolioUpload.js    ← NEW
│       │   └── PortfolioComparison.js        ← NEW
│       ├── styles/
│       │   └── App.css                       (updated)
│       ├── App.js                            (updated)
│       └── index.js
├── portfolios/                               ← NEW
│   ├── portfolio_[id].json
│   └── portfolio_existing_[id].json
├── ACCOUNT_PORTFOLIO_GUIDE.md                ← NEW
├── IMPLEMENTATION_SUMMARY.md                 ← NEW
├── PORTFOLIO_COMPARISON_QUICKSTART.md        ← NEW
├── ARCHITECTURE_DIAGRAM.md                   ← NEW
└── test-account-features.sh                  ← NEW
```

---

This architecture maintains MiFID II compliance while providing a seamless workflow for portfolio comparison and client advisory services.
