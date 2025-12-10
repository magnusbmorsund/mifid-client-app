# ✅ Multi-Tenant Risk Configuration System

## Overview

Your application now has a **complete multi-tenant risk configuration system** that allows you to:
- ✅ **Remove financial situation** from risk scoring (only knowledge, objectives, tolerance matter)
- ✅ **Create multiple tenant configurations** (Retail, Private Banking, etc.)
- ✅ **Configure different instruments** per tenant per risk level
- ✅ **Manage tenants** via web interface

## 🌐 Access

**Multi-Tenant Configuration Interface:** http://localhost:5001/risk-config-multi-tenant.html

## Key Changes

### 1. ❌ Financial Situation Removed from Risk Scoring

**Before:**
- Risk score included income, net worth, investable assets
- Financial data affected risk level

**After:**
- Risk score based ONLY on:
  - **Knowledge & Experience** (years investing, education, instrument knowledge)
  - **Investment Objectives** (time horizon, primary objective)
  - **Risk Tolerance** (aggressive/moderate/conservative)

### 2. 🏢 Multi-Tenant System

**Default Tenants:**
- **Retail Banking** - Standard retail clients (limited instruments)
- **Private Banking** - High net worth clients (full instrument access)

**Example Differences:**

| Risk Level | Retail Instruments | Private Banking Instruments |
|------------|-------------------|----------------------------|
| Level 7 | 5 instruments | 10 instruments |
| Level 6 | Limited options | Options, futures, crypto |
| Level 1 | Basic bonds | Bonds + bond funds |

## Features

### 🎯 Tenant Management

**View All Tenants:**
- See all configured client segments
- Switch between tenants instantly
- Visual tenant selector

**Create New Tenant:**
1. Click "➕ New Tenant"
2. Enter ID (e.g., `wealth_management`)
3. Enter name (e.g., "Wealth Management")
4. Enter description
5. Starts with retail template
6. Customize as needed

**Delete Tenant:**
- Delete custom tenants
- Cannot delete default tenants (retail, private_banking)

### 📊 Per-Tenant Configuration

Each tenant has its own:
- **Scoring Rules** - Point values for answers
- **Risk Levels** - Score thresholds
- **Allowed Instruments** - Different instruments per level

## API Endpoints

### Get All Tenants
```bash
GET /api/tenants
```

**Response:**
```json
{
  "tenants": [
    {
      "id": "retail",
      "name": "Retail Banking",
      "description": "Standard retail banking clients"
    },
    {
      "id": "private_banking",
      "name": "Private Banking",
      "description": "High net worth private banking clients"
    }
  ]
}
```

### Get Tenant Configuration
```bash
GET /api/risk-configuration/:tenant
```

**Example:**
```bash
curl http://localhost:5001/api/risk-configuration/retail
```

### Update Tenant Configuration
```bash
PUT /api/risk-configuration/:tenant
```

**Example:**
```bash
curl -X PUT http://localhost:5001/api/risk-configuration/retail \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Retail Banking",
    "description": "Updated description",
    "scoringRules": {...},
    "riskLevels": [...]
  }'
```

### Create New Tenant
```bash
POST /api/risk-configuration/:tenant
```

**Example:**
```bash
curl -X POST http://localhost:5001/api/risk-configuration/wealth_management \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wealth Management",
    "description": "Ultra high net worth clients",
    "scoringRules": {...},
    "riskLevels": [...]
  }'
```

### Delete Tenant
```bash
DELETE /api/risk-configuration/:tenant
```

**Example:**
```bash
curl -X DELETE http://localhost:5001/api/risk-configuration/wealth_management
```

## Client Assignment

### Create Client with Tenant

```bash
curl -X POST http://localhost:5001/api/clients/new \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "tenant": "private_banking"
  }'
```

**Response:**
```json
{
  "message": "Client created successfully",
  "client": {
    "id": "1234567890",
    "tenant": "private_banking",
    "personalInfo": {...}
  },
  "tenantConfig": "Private Banking"
}
```

### Default Tenant

If no tenant specified, defaults to `retail`:

```bash
curl -X POST http://localhost:5001/api/clients/new \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com"
  }'
```

Client will be assigned to `retail` tenant.

## Use Cases

### Use Case 1: Different Instruments for Segments

**Scenario:** Private banking clients should access crypto, retail clients should not

**Steps:**
1. Open http://localhost:5001/risk-config-multi-tenant.html
2. Select "Private Banking" tenant
3. Go to Level 7 risk level
4. Check "crypto" checkbox
5. Save configuration
6. Select "Retail Banking" tenant
7. Go to Level 7 risk level
8. Uncheck "crypto" checkbox
9. Save configuration

**Result:**
- Private banking Level 7 clients can access crypto
- Retail Level 7 clients cannot access crypto

### Use Case 2: Create Wealth Management Segment

**Scenario:** Create new segment for ultra-high net worth clients

**Steps:**
1. Open multi-tenant configuration
2. Click "➕ New Tenant"
3. Enter:
   - ID: `wealth_management`
   - Name: `Wealth Management`
   - Description: `Ultra high net worth clients`
4. Click "Create"
5. Modify scoring rules (e.g., higher points for experience)
6. Add more instruments to risk levels
7. Save configuration

**Result:**
- New tenant created
- Can assign clients to wealth_management
- Custom rules and instruments

### Use Case 3: Conservative Retail vs Aggressive Private

**Scenario:** Make retail more conservative than private banking

**Steps:**
1. Select "Retail Banking"
2. Increase score thresholds (e.g., Level 5 now requires 60-75 instead of 56-70)
3. Remove high-risk instruments from lower levels
4. Save
5. Select "Private Banking"
6. Keep lower thresholds
7. Add more instruments to all levels
8. Save

**Result:**
- Retail clients need higher scores for same risk level
- Private banking clients access more instruments at same level

## Configuration Structure

### Tenant Object

```json
{
  "retail": {
    "name": "Retail Banking",
    "description": "Standard retail banking clients",
    "scoringRules": {
      "knowledgeExperience": {...},
      "objectives": {...},
      "riskTolerance": {...}
    },
    "riskLevels": [...]
  }
}
```

### Scoring Rules (No Financial Situation!)

```json
{
  "scoringRules": {
    "knowledgeExperience": {
      "yearsInvesting": [
        { "min": 10, "max": null, "points": 20, "label": "Over 10 years" }
      ],
      "educationLevel": {
        "finance_degree": { "points": 15, "label": "Finance Degree" }
      }
    },
    "objectives": {
      "timeHorizon": {
        "long": { "points": 15, "label": "Long-term (10+ years)" }
      },
      "primaryObjective": {
        "aggressive_growth": { "points": 15, "label": "Aggressive Growth" }
      }
    },
    "riskTolerance": {
      "level": {
        "aggressive": { "points": 20, "label": "Aggressive" }
      }
    }
  }
}
```

### Risk Levels

```json
{
  "riskLevels": [
    {
      "level": 7,
      "minScore": 86,
      "maxScore": 999,
      "category": "Very High Risk",
      "allowedInstruments": ["stocks", "options", "futures", "crypto", ...]
    }
  ]
}
```

## Testing

### Test 1: Verify Financial Situation Removed

```bash
# Get retail configuration
curl http://localhost:5001/api/risk-configuration/retail | jq '.scoringRules | keys'

# Should return: ["knowledgeExperience", "objectives", "riskTolerance"]
# Should NOT include "financialSituation"
```

### Test 2: Compare Tenant Instruments

```bash
# Retail Level 7 instruments
curl http://localhost:5001/api/risk-configuration/retail | \
  jq '.riskLevels[6].allowedInstruments'

# Private Banking Level 7 instruments
curl http://localhost:5001/api/risk-configuration/private_banking | \
  jq '.riskLevels[6].allowedInstruments'

# Private banking should have MORE instruments
```

### Test 3: Create Client with Tenant

```bash
# Create private banking client
curl -X POST http://localhost:5001/api/clients/new \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "tenant": "private_banking"
  }' | jq '.client.tenant'

# Should return: "private_banking"
```

### Test 4: Risk Calculation Without Financial Data

```bash
# Create client
CLIENT_ID=$(curl -s -X POST http://localhost:5001/api/clients/new \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","tenant":"retail"}' | \
  jq -r '.client.id')

# Add only knowledge (no financial data)
curl -X POST http://localhost:5001/api/clients/$CLIENT_ID/knowledge-experience \
  -H "Content-Type: application/json" \
  -d '{
    "yearsInvesting": 15,
    "educationLevel": "finance_degree"
  }' | jq '.riskProfile'

# Should calculate risk score WITHOUT financial situation
```

## Workflow Example

### Complete Multi-Tenant Setup

```bash
# 1. Get available tenants
curl http://localhost:5001/api/tenants

# 2. Create new tenant
curl -X POST http://localhost:5001/api/risk-configuration/premium \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Banking",
    "description": "Premium tier clients",
    "scoringRules": {
      "knowledgeExperience": {...},
      "objectives": {...},
      "riskTolerance": {...}
    },
    "riskLevels": [...]
  }'

# 3. Create client in new tenant
curl -X POST http://localhost:5001/api/clients/new \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Premium",
    "lastName": "Client",
    "email": "premium@example.com",
    "tenant": "premium"
  }'

# 4. Update tenant configuration
curl -X PUT http://localhost:5001/api/risk-configuration/premium \
  -H "Content-Type": "application/json" \
  -d '{...updated config...}'

# 5. Delete tenant (if needed)
curl -X DELETE http://localhost:5001/api/risk-configuration/premium
```

## Key Differences: Retail vs Private Banking

### Retail Banking
- **Conservative approach**
- **Limited instruments** at high risk levels
- **No crypto** even at Level 7
- **No futures** or leveraged products
- **Focus:** Capital preservation

### Private Banking
- **Aggressive approach**
- **Full instrument access** at high levels
- **Crypto available** at Level 6+
- **Options, futures** at Level 5+
- **Focus:** Wealth maximization

### Example Level 7 Comparison

**Retail Level 7:**
- stocks
- etfs
- commodities
- reits
- high_yield_bonds

**Private Banking Level 7:**
- stocks
- options
- futures
- leveraged_etfs
- commodities
- crypto
- bonds
- etfs
- reits
- high_yield_bonds

## Best Practices

### 1. Tenant Naming
- Use lowercase with underscores (e.g., `wealth_management`)
- Keep IDs short and descriptive
- Use clear display names

### 2. Instrument Allocation
- Start conservative, add instruments gradually
- Consider regulatory requirements per segment
- Document why certain instruments are restricted

### 3. Scoring Consistency
- Keep scoring logic similar across tenants
- Only adjust thresholds and instruments
- Document any major differences

### 4. Testing
- Test each tenant separately
- Verify instrument restrictions work
- Check risk calculations are correct

### 5. Documentation
- Document each tenant's purpose
- Note instrument restrictions and why
- Keep change log

## Troubleshooting

### Issue: Client assigned wrong tenant
**Solution:**
- Tenant is set at client creation
- Cannot change tenant after creation
- Create new client with correct tenant

### Issue: Configuration not saving
**Solution:**
- Ensure you clicked "Save Configuration"
- Check browser console for errors
- Verify tenant exists

### Issue: Instruments not showing
**Solution:**
- Check tenant configuration
- Verify risk level matches
- Ensure instruments are checked in config

## Summary

### ✅ What Changed

- **Removed:** Financial situation from risk scoring
- **Added:** Multi-tenant configuration system
- **Added:** Tenant-specific instrument allocation
- **Added:** Web interface for tenant management

### 🎯 Benefits

- **Flexibility:** Different rules for different segments
- **Compliance:** Appropriate instruments per client type
- **Scalability:** Easy to add new segments
- **Control:** Full control over risk assessment per segment

### 📊 Impact

- **Risk Calculation:** Now based only on knowledge, objectives, tolerance
- **Instrument Access:** Varies by tenant and risk level
- **Client Management:** Clients assigned to specific tenants
- **Configuration:** Separate configs per tenant

---

**Access Now:**
- **Multi-Tenant Interface:** http://localhost:5001/risk-config-multi-tenant.html
- **API Interface:** http://localhost:5001/
- **Tenants API:** http://localhost:5001/api/tenants

**Ready to configure your client segments!** 🚀
