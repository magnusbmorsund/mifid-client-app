# API Reference

**Base URL:** `http://localhost:5001/api`  
**Last Updated:** December 10, 2024

---

## Table of Contents

1. [Authentication](#authentication)
2. [Client Endpoints](#client-endpoints)
3. [Portfolio Endpoints](#portfolio-endpoints)
4. [Account Endpoints](#account-endpoints)
5. [Instrument Endpoints](#instrument-endpoints)
6. [Risk Configuration Endpoints](#risk-configuration-endpoints)
7. [Error Responses](#error-responses)

---

## Authentication

### Protected Endpoints
All `POST` endpoints that create or modify data require authentication.

**Header:**
```
X-API-Key: your_api_key_here
```

**Generate API Key:**
```bash
cd backend
node generateApiKey.js "Your Company Name"
```

**Rate Limit:** 100 requests per minute per API key

---

## Client Endpoints

### Create Client
**`POST /api/clients`** 🔒 Protected

Create a new client with full profile and calculate risk assessment.

**Headers:**
```
Content-Type: application/json
X-API-Key: your_api_key
```

**Request Body:**
```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+47 123 45 678",
    "dateOfBirth": "1985-05-15",
    "nationality": "Norwegian",
    "address": "Oslo, Norway"
  },
  "financialSituation": {
    "annualIncome": 100000,
    "netWorth": 500000,
    "investableAssets": 200000,
    "amountForAdvice": 50000,
    "employmentStatus": "employed",
    "sourceOfWealth": "salary"
  },
  "knowledgeExperience": {
    "yearsInvesting": 5,
    "educationLevel": "university",
    "instrumentKnowledge": [
      { "instrument": "stocks", "knowledge": "experienced" }
    ]
  },
  "objectives": {
    "primaryObjective": "growth",
    "timeHorizon": "long"
  },
  "riskTolerance": {
    "level": "moderate"
  },
  "sustainability": {
    "esgImportance": "important"
  },
  "tenant": "retail"
}
```

**Response:** `200 OK`
```json
{
  "id": "1733841234567",
  "personalInfo": { ... },
  "financialSituation": { ... },
  "knowledgeExperience": { ... },
  "objectives": { ... },
  "riskTolerance": { ... },
  "sustainability": { ... },
  "riskProfile": {
    "riskScore": 65,
    "riskLevel": 5,
    "riskCategory": "Moderate-High Risk",
    "allowedInstruments": ["stocks", "etfs", "bonds", "mutual_funds", "reits"],
    "factors": ["Extensive investment experience"],
    "tenant": "retail"
  },
  "createdAt": "2024-12-10T12:00:00.000Z",
  "updatedAt": "2024-12-10T12:00:00.000Z"
}
```

---

### Create Minimal Client
**`POST /api/clients/new`** 🔒 Protected

Create a client with minimal information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "tenant": "retail"
}
```

**Response:** `201 Created`

---

### Get All Clients
**`GET /api/clients`** 🔓 Public

Get list of all clients.

**Response:** `200 OK`
```json
[
  {
    "id": "1733841234567",
    "personalInfo": { ... },
    "riskProfile": { ... }
  }
]
```

---

### Get Client by ID
**`GET /api/clients/:id`** 🔓 Public

Get specific client details.

**Response:** `200 OK`
```json
{
  "id": "1733841234567",
  "personalInfo": { ... },
  "riskProfile": { ... }
}
```

---

### Update Personal Info
**`POST /api/clients/:id/personal-info`** 🔒 Protected

Update client's personal information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+47 123 45 678"
}
```

---

### Update Financial Situation
**`POST /api/clients/:id/financial-situation`** 🔒 Protected

Update financial situation and recalculate risk.

**Request Body:**
```json
{
  "annualIncome": 120000,
  "netWorth": 600000,
  "investableAssets": 250000
}
```

---

### Update Knowledge & Experience
**`POST /api/clients/:id/knowledge-experience`** 🔒 Protected

Update investment knowledge and recalculate risk.

**Request Body:**
```json
{
  "yearsInvesting": 7,
  "educationLevel": "finance_degree",
  "instrumentKnowledge": [
    { "instrument": "stocks", "knowledge": "expert" },
    { "instrument": "bonds", "knowledge": "experienced" }
  ]
}
```

---

### Update Objectives
**`POST /api/clients/:id/objectives`** 🔒 Protected

Update investment objectives and recalculate risk.

**Request Body:**
```json
{
  "primaryObjective": "aggressive_growth",
  "timeHorizon": "long",
  "liquidityNeeds": "low"
}
```

---

### Update Risk Tolerance
**`POST /api/clients/:id/risk-tolerance`** 🔒 Protected

Update risk tolerance and recalculate risk.

**Request Body:**
```json
{
  "level": "aggressive",
  "maxDrawdown": 30,
  "volatilityComfort": "high"
}
```

---

### Update Sustainability
**`POST /api/clients/:id/sustainability`** 🔒 Protected

Update sustainability preferences.

**Request Body:**
```json
{
  "esgImportance": "very_important",
  "excludeSectors": ["tobacco", "weapons", "fossil_fuels"],
  "preferredSectors": ["renewable_energy", "healthcare"]
}
```

---

### Delete Client
**`DELETE /api/clients/:id`** 🔒 Admin

Delete a client.

**Response:** `200 OK`

---

## Portfolio Endpoints

### Create Portfolio
**`POST /api/portfolios`** 🔒 Protected

Create a new portfolio.

**Request Body:**
```json
{
  "clientId": "1733841234567",
  "clientName": "John Doe",
  "name": "Growth Portfolio",
  "holdings": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "allocation": 30,
      "currentPrice": 175.50,
      "type": "stocks"
    },
    {
      "symbol": "MSFT",
      "name": "Microsoft Corp.",
      "allocation": 30,
      "currentPrice": 380.25,
      "type": "stocks"
    }
  ],
  "totalValue": 50000,
  "amountForAdvice": 50000
}
```

**Response:** `200 OK`
```json
{
  "id": "1733841298765",
  "clientId": "1733841234567",
  "name": "Growth Portfolio",
  "type": "proposed",
  "holdings": [ ... ],
  "totalValue": 50000,
  "createdAt": "2024-12-10T13:00:00.000Z",
  "savedToFile": "portfolios/portfolio_1733841298765.json"
}
```

---

### Get Portfolios for Client
**`GET /api/portfolios/:clientId`** 🔓 Public

Get all portfolios for a specific client.

**Response:** `200 OK`
```json
[
  {
    "id": "1733841298765",
    "name": "Growth Portfolio",
    "type": "proposed",
    "totalValue": 50000
  }
]
```

---

### Compare Portfolios
**`POST /api/portfolios/compare`** 🔓 Public

Compare two portfolios.

**Request Body:**
```json
{
  "existingPortfolioId": "1733841234567",
  "proposedPortfolioId": "1733841298765"
}
```

**Response:** `200 OK`
```json
{
  "existing": {
    "id": "1733841234567",
    "name": "Current Portfolio",
    "totalValue": 36000,
    "holdings": [ ... ]
  },
  "proposed": {
    "id": "1733841298765",
    "name": "Growth Portfolio",
    "totalValue": 50000,
    "holdings": [ ... ]
  },
  "differences": {
    "valueChange": 14000,
    "valueChangePercent": 38.89,
    "addedHoldings": 2,
    "removedHoldings": 0,
    "modifiedHoldings": 2
  },
  "holdingsAnalysis": {
    "added": [
      { "symbol": "SPY", "allocation": 30 }
    ],
    "removed": [],
    "modified": [
      {
        "symbol": "AAPL",
        "oldAllocation": 48.6,
        "newAllocation": 20,
        "change": -28.6
      }
    ]
  },
  "allocationChanges": [ ... ]
}
```

---

## Account Endpoints

### Create Account
**`POST /api/accounts`** 🔒 Protected

Create or get account for a client.

**Request Body:**
```json
{
  "clientId": "1733841234567"
}
```

**Response:** `200 OK`
```json
{
  "accountId": "acc_1733841234567",
  "clientId": "1733841234567",
  "existingPortfolios": [],
  "proposedPortfolios": [],
  "createdAt": "2024-12-10T12:00:00.000Z"
}
```

---

### Get Account
**`GET /api/accounts/:clientId`** 🔓 Public

Get account with full portfolio data.

**Response:** `200 OK`
```json
{
  "accountId": "acc_1733841234567",
  "clientId": "1733841234567",
  "existingPortfolios": [
    { "id": "...", "name": "Current Portfolio", ... }
  ],
  "proposedPortfolios": [
    { "id": "...", "name": "Growth Portfolio", ... }
  ]
}
```

---

### Upload Existing Portfolio
**`POST /api/accounts/:clientId/existing-portfolio`** 🔒 Protected

Upload client's existing portfolio holdings.

**Request Body:**
```json
{
  "name": "Current Portfolio",
  "holdings": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "quantity": 10,
      "currentValue": 1755,
      "type": "stocks"
    },
    {
      "symbol": "MSFT",
      "name": "Microsoft Corp.",
      "quantity": 50,
      "currentValue": 19012.50,
      "type": "stocks"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "message": "Existing portfolio uploaded successfully",
  "portfolio": {
    "id": "1733841234567",
    "name": "Current Portfolio",
    "type": "existing",
    "totalValue": 36000,
    "holdings": [ ... ]
  }
}
```

---

## Instrument Endpoints

### Filter Instruments
**`POST /api/instruments/filter`** 🔓 Public

Get instruments filtered by risk profile.

**Request Body:**
```json
{
  "riskLevel": 5,
  "allowedInstruments": ["stocks", "etfs", "bonds", "mutual_funds"],
  "sustainabilityPreferences": {
    "excludeSectors": ["tobacco"]
  }
}
```

**Response:** `200 OK`
```json
{
  "riskLevel": 5,
  "totalInstruments": 15,
  "instruments": [
    {
      "symbol": "AAPL",
      "name": "AAPL",
      "price": 175.50,
      "currency": "USD",
      "change": "1.25",
      "changeValue": "2.19",
      "high": 176.80,
      "low": 174.20,
      "open": 175.00,
      "previousClose": 174.31,
      "exchange": "US",
      "type": "stocks"
    }
  ]
}
```

---

### Get Historical Data
**`POST /api/instruments/historical`** 🔓 Public

Get historical price data for instruments.

**Request Body:**
```json
{
  "symbols": ["AAPL", "MSFT", "GOOGL"],
  "range": "1y"
}
```

**Range Options:** `1mo`, `3mo`, `6mo`, `1y`, `5y`

**Response:** `200 OK`
```json
{
  "symbols": ["AAPL", "MSFT", "GOOGL"],
  "range": "1y",
  "data": {
    "AAPL": {
      "symbol": "AAPL",
      "data": [
        { "date": "2023-12-10", "value": 100 },
        { "date": "2024-01-10", "value": 105.2 }
      ]
    }
  }
}
```

---

### Search EODHD Instruments
**`POST /api/eodhd/instruments/search`** 🔓 Public

Search for instruments by criteria.

**Request Body:**
```json
{
  "exchange": "US",
  "type": "Common Stock",
  "country": "USA",
  "search": "Apple"
}
```

---

### Get EODHD Instruments
**`GET /api/eodhd/instruments/:exchange`** 🔓 Public

Get all instruments from an exchange.

**Example:** `GET /api/eodhd/instruments/US`

---

### Get EODHD Exchanges
**`GET /api/eodhd/exchanges`** 🔓 Public

Get list of available exchanges.

**Response:** `200 OK`
```json
[
  { "code": "US", "name": "US Exchanges (NYSE, NASDAQ)", "country": "USA" },
  { "code": "LSE", "name": "London Stock Exchange", "country": "UK" }
]
```

---

## Risk Configuration Endpoints

### Get All Configurations
**`GET /api/risk-configuration`** 🔓 Public

Get all tenant risk configurations.

**Response:** `200 OK`
```json
{
  "retail": {
    "name": "Retail Banking",
    "description": "Standard retail banking clients",
    "scoringRules": { ... },
    "riskLevels": [ ... ]
  },
  "private_banking": {
    "name": "Private Banking",
    "description": "High net worth clients",
    "scoringRules": { ... },
    "riskLevels": [ ... ]
  }
}
```

---

### Get Tenant Configuration
**`GET /api/risk-configuration/:tenant`** 🔓 Public

Get specific tenant configuration.

**Example:** `GET /api/risk-configuration/retail`

---

### Get Tenants
**`GET /api/tenants`** 🔓 Public

Get list of available tenants.

**Response:** `200 OK`
```json
[
  { "id": "retail", "name": "Retail Banking" },
  { "id": "private_banking", "name": "Private Banking" }
]
```

---

### Update Configuration
**`PUT /api/risk-configuration/:tenant`** 🔒 Admin

Update tenant risk configuration.

---

### Create Configuration
**`POST /api/risk-configuration/:tenant`** 🔒 Admin

Create new tenant configuration.

---

### Delete Configuration
**`DELETE /api/risk-configuration/:tenant`** 🔒 Admin

Delete tenant configuration.

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required client data"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "message": "API key is missing. Please provide X-API-Key header.",
  "documentation": "Run \"node generateApiKey.js [client-name]\" to generate an API key"
}
```

### 403 Forbidden
```json
{
  "error": "API key revoked",
  "message": "This API key has been revoked and is no longer valid.",
  "revokedAt": "2024-12-10T12:00:00.000Z"
}
```

### 404 Not Found
```json
{
  "error": "Client not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Limit: 100 requests per 60 seconds.",
  "retryAfter": 45,
  "limit": 100,
  "remaining": 0,
  "resetTime": "2024-12-10T12:01:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to calculate risk profile",
  "details": "Error message"
}
```

---

## Rate Limit Headers

All responses include rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-12-10T12:01:00.000Z
```

---

## cURL Examples

### Create Client
```bash
curl -X POST http://localhost:5001/api/clients \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "financialSituation": {
      "annualIncome": 100000,
      "netWorth": 500000,
      "investableAssets": 200000
    },
    "knowledgeExperience": {
      "yearsInvesting": 5,
      "educationLevel": "university"
    },
    "objectives": {
      "primaryObjective": "growth",
      "timeHorizon": "long"
    },
    "riskTolerance": {
      "level": "moderate"
    }
  }'
```

### Get Clients
```bash
curl http://localhost:5001/api/clients
```

### Filter Instruments
```bash
curl -X POST http://localhost:5001/api/instruments/filter \
  -H "Content-Type: application/json" \
  -d '{
    "riskLevel": 5,
    "allowedInstruments": ["stocks", "etfs", "bonds"]
  }'
```

### Create Portfolio
```bash
curl -X POST http://localhost:5001/api/portfolios \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "clientId": "1733841234567",
    "clientName": "John Doe",
    "name": "Growth Portfolio",
    "holdings": [
      {
        "symbol": "AAPL",
        "allocation": 50,
        "currentPrice": 175.50
      }
    ],
    "totalValue": 50000
  }'
```

---

**Last Updated:** December 10, 2024  
**Version:** 1.0.0
