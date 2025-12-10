# Risk Configuration Fix - December 10, 2024

## Issue
The risk configuration interface was showing the error:
```
Error loading configuration: Cannot convert undefined or null to object
```

## Root Cause
The `financialSituation` scoring rules were **missing** from the risk configuration structure. The interface expected:
```javascript
configuration.scoringRules.financialSituation
```

But the configuration only had:
- `knowledgeExperience`
- `objectives`
- `riskTolerance`

## Fix Applied

Added `financialSituation` scoring rules to both tenants in `/backend/server.js`:

### Retail Tenant
```javascript
financialSituation: {
  annualIncome: [
    { min: 0, max: 300000, points: 5, label: 'Low Income' },
    { min: 300000, max: 750000, points: 10, label: 'Medium Income' },
    { min: 750000, max: 1500000, points: 15, label: 'High Income' },
    { min: 1500000, max: null, points: 20, label: 'Very High Income' }
  ],
  netWorth: [
    { min: 0, max: 500000, points: 5, label: 'Low Net Worth' },
    { min: 500000, max: 2000000, points: 10, label: 'Medium Net Worth' },
    { min: 2000000, max: 5000000, points: 15, label: 'High Net Worth' },
    { min: 5000000, max: null, points: 20, label: 'Very High Net Worth' }
  ],
  investableAssets: [
    { min: 0, max: 250000, points: 5, label: 'Low Assets' },
    { min: 250000, max: 1000000, points: 10, label: 'Medium Assets' },
    { min: 1000000, max: 2500000, points: 15, label: 'High Assets' },
    { min: 2500000, max: null, points: 20, label: 'Very High Assets' }
  ]
}
```

### Private Banking Tenant
```javascript
financialSituation: {
  annualIncome: [
    { min: 0, max: 500000, points: 5, label: 'Low Income' },
    { min: 500000, max: 1500000, points: 10, label: 'Medium Income' },
    { min: 1500000, max: 3000000, points: 15, label: 'High Income' },
    { min: 3000000, max: null, points: 20, label: 'Very High Income' }
  ],
  netWorth: [
    { min: 0, max: 2000000, points: 5, label: 'Low Net Worth' },
    { min: 2000000, max: 5000000, points: 10, label: 'Medium Net Worth' },
    { min: 5000000, max: 10000000, points: 15, label: 'High Net Worth' },
    { min: 10000000, max: null, points: 20, label: 'Ultra High Net Worth' }
  ],
  investableAssets: [
    { min: 0, max: 1000000, points: 5, label: 'Low Assets' },
    { min: 1000000, max: 2500000, points: 10, label: 'Medium Assets' },
    { min: 2500000, max: 5000000, points: 15, label: 'High Assets' },
    { min: 5000000, max: null, points: 20, label: 'Very High Assets' }
  ]
}
```

## Key Differences Between Tenants

### Retail Banking
- **Annual Income**: Up to 1.5M for "High Income"
- **Net Worth**: Up to 5M for "High Net Worth"
- **Investable Assets**: Up to 2.5M for "High Assets"
- **Target**: Standard retail banking clients

### Private Banking
- **Annual Income**: Up to 3M for "High Income"
- **Net Worth**: Up to 10M for "High Net Worth" (Ultra High Net Worth above)
- **Investable Assets**: Up to 5M for "High Assets"
- **Target**: High net worth and ultra-high net worth clients

## How It Works

The financial situation scoring contributes to the overall risk score:

1. **Annual Income** → 5-20 points based on range
2. **Net Worth** → 5-20 points based on range
3. **Investable Assets** → 5-20 points based on range

**Maximum Financial Points**: 60 points (20 + 20 + 20)

Combined with:
- Knowledge & Experience: up to 50 points
- Objectives: up to 30 points
- Risk Tolerance: up to 20 points

**Total Maximum Score**: ~160 points

## Testing

### Restart Backend
```bash
cd backend
npm start
```

### Test Interface
1. Open: `http://localhost:5001/risk-config.html`
2. Should now load without errors
3. You'll see "Financial Situation" section with:
   - Annual Income rules
   - Net Worth rules
   - Investable Assets rules

### Verify Configuration
```bash
curl http://localhost:5001/api/risk-configuration/retail | jq '.scoringRules.financialSituation'
```

Should return the financial situation rules.

## Impact

This fix ensures:
1. ✅ Risk configuration interface loads correctly
2. ✅ Financial situation is properly scored in risk calculations
3. ✅ Both retail and private banking tenants have complete configurations
4. ✅ Higher thresholds for private banking reflect their client base

## Next Steps

You can now:
- Adjust the point values for each range
- Modify the income/wealth thresholds
- Add more granular ranges if needed
- Create additional tenant configurations

All changes can be made through the web interface and will be saved to the in-memory configuration.

---

**Status**: ✅ Fixed and Ready
**Date**: December 10, 2024
