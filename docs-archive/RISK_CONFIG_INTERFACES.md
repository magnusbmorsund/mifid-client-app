# Risk Configuration Interfaces

## Overview

There are two web interfaces for managing risk configurations in the MiFID II system:

1. **Single-Tenant Interface** - For managing the Retail tenant
2. **Multi-Tenant Interface** - For managing all tenants

## 1. Single-Tenant Interface (Retail)

**URL**: `http://localhost:5001/risk-config.html`

### Purpose
Simplified interface for configuring the **Retail tenant** risk settings.

### Features
- Configure scoring rules for:
  - Financial Situation
  - Knowledge & Experience
  - Investment Objectives
  - Risk Tolerance
- Set risk levels (1-10) with score ranges
- Define allowed instruments per risk level
- Save, reload, and reset configurations

### Use When
- You only need to manage retail banking configurations
- You want a simpler, focused interface
- You're working with the default tenant

### API Endpoints Used
- `GET /api/risk-configuration/retail` - Load retail config
- `PUT /api/risk-configuration/retail` - Save retail config

---

## 2. Multi-Tenant Interface

**URL**: `http://localhost:5001/risk-config-multi-tenant.html`

### Purpose
Comprehensive interface for managing **multiple tenant configurations** (retail, private banking, wealth management, etc.).

### Features
- Switch between different tenants
- Create new tenant configurations
- Delete tenant configurations
- All features from single-tenant interface
- Tenant-specific customization

### Use When
- You need to manage multiple business units
- Different risk profiles for different client segments
- Custom configurations per tenant

### API Endpoints Used
- `GET /api/risk-configuration` - Load all tenants
- `GET /api/risk-configuration/:tenant` - Load specific tenant
- `POST /api/risk-configuration/:tenant` - Create new tenant
- `PUT /api/risk-configuration/:tenant` - Update tenant
- `DELETE /api/risk-configuration/:tenant` - Delete tenant

---

## Quick Start

### Access the Interfaces

1. **Start the backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Open in browser**:
   - Single-tenant: `http://localhost:5001/risk-config.html`
   - Multi-tenant: `http://localhost:5001/risk-config-multi-tenant.html`

### Default Tenants

The system comes with two pre-configured tenants:

1. **retail** - Retail banking clients
   - Conservative risk approach
   - Standard instruments
   - Broader client base

2. **private_banking** - Private banking/wealth management
   - More aggressive options available
   - Advanced instruments
   - High-net-worth clients

---

## Configuration Structure

Each tenant configuration includes:

### Scoring Rules
```javascript
{
  financialSituation: {
    annualIncome: [
      { min: 0, max: 300000, points: 1, label: "Low" },
      { min: 300000, max: 750000, points: 2, label: "Medium" },
      { min: 750000, max: null, points: 3, label: "High" }
    ],
    netWorth: [...],
    investableAssets: [...]
  },
  knowledgeExperience: {
    yearsInvesting: [...],
    educationLevel: {...}
  },
  objectives: {
    timeHorizon: {...},
    primaryObjective: {...}
  },
  riskTolerance: {
    level: {...}
  }
}
```

### Risk Levels
```javascript
{
  riskLevels: [
    {
      level: 1,
      category: "Very Conservative",
      minScore: 0,
      maxScore: 20,
      allowedInstruments: ["bonds", "money_market", "savings"]
    },
    // ... levels 2-10
  ]
}
```

---

## Common Tasks

### 1. Adjust Risk Scoring

**Single-Tenant Interface**:
1. Navigate to the scoring section (Financial, Knowledge, etc.)
2. Modify the point values
3. Click "Save Configuration"

**Multi-Tenant Interface**:
1. Select the tenant from the dropdown
2. Follow same steps as single-tenant
3. Switch tenants to configure others

### 2. Change Allowed Instruments

1. Scroll to "Risk Levels & Instruments" section
2. Find the risk level you want to modify
3. Check/uncheck instruments
4. Click "Save Configuration"

### 3. Create New Tenant

**Multi-Tenant Interface Only**:
1. Click "Create New Tenant"
2. Enter tenant name (e.g., "wealth_management")
3. Configure scoring rules and risk levels
4. Click "Save Configuration"

### 4. Reset to Defaults

1. Click "Reset to Defaults" button
2. Confirm the action
3. Configuration will revert to system defaults

---

## Troubleshooting

### Error: "Cannot read properties of undefined"

**Cause**: The single-tenant interface was trying to load all tenants instead of a specific one.

**Fix**: ✅ **Already Fixed** - The interface now loads the retail tenant by default.

**If you still see this error**:
1. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Restart the backend server

### Configuration Not Saving

**Check**:
1. Backend server is running (`npm start` in backend folder)
2. No console errors (F12 → Console tab)
3. Network tab shows successful PUT request (status 200)

### Tenant Not Found

**For Multi-Tenant Interface**:
1. Verify tenant name is correct
2. Check available tenants: `GET http://localhost:5001/api/risk-configuration`
3. Create tenant if it doesn't exist

---

## API Testing

Test the configuration endpoints directly:

### Get All Tenants
```bash
curl http://localhost:5001/api/risk-configuration
```

### Get Specific Tenant
```bash
curl http://localhost:5001/api/risk-configuration/retail
```

### Update Tenant
```bash
curl -X PUT http://localhost:5001/api/risk-configuration/retail \
  -H "Content-Type: application/json" \
  -d @config.json
```

### Create New Tenant
```bash
curl -X POST http://localhost:5001/api/risk-configuration/wealth_management \
  -H "Content-Type: application/json" \
  -d @config.json
```

---

## Best Practices

### 1. Backup Before Changes
- Export current configuration before major changes
- Use browser's "Save Page As" to backup the interface state

### 2. Test Changes
- Create a test client after configuration changes
- Verify risk scoring works as expected
- Check instrument filtering is correct

### 3. Document Custom Rules
- Keep notes on why specific rules were changed
- Document tenant-specific requirements
- Track configuration version history

### 4. Use Multi-Tenant for Production
- Better organization for multiple business units
- Easier to manage different client segments
- More flexible for future expansion

---

## Integration with Client Profiling

### How It Works

1. **Client completes profile** → Frontend sends data to backend
2. **Backend calculates risk score** → Uses tenant-specific scoring rules
3. **Risk level determined** → Based on score ranges in configuration
4. **Instruments filtered** → Only allowed instruments for that risk level
5. **Portfolio created** → Using filtered instruments

### Tenant Selection

The tenant is selected when creating a client:
- Default: `retail`
- Can be specified in API calls
- Stored with client profile

### Example Flow

```
Client Profile → Risk Score: 65 → Risk Level: 6 (Moderate-Aggressive)
                                  ↓
                    Allowed Instruments: stocks, bonds, etfs, mutual_funds, reits
                                  ↓
                    Portfolio Builder shows only these instruments
```

---

## Summary

| Feature | Single-Tenant | Multi-Tenant |
|---------|--------------|--------------|
| **URL** | `/risk-config.html` | `/risk-config-multi-tenant.html` |
| **Manages** | Retail tenant only | All tenants |
| **Complexity** | Simple | Advanced |
| **Best For** | Single business unit | Multiple segments |
| **Tenant Switching** | ❌ No | ✅ Yes |
| **Create Tenants** | ❌ No | ✅ Yes |
| **Delete Tenants** | ❌ No | ✅ Yes |

---

**Recommendation**: Use the **Multi-Tenant Interface** for full flexibility and easier management of different client segments.

**Updated**: December 10, 2024
