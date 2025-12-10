# ✅ Risk Configuration System - Quick Reference

## 🌐 Access

**Configuration Interface:** http://localhost:5001/risk-config.html

## What You Can Configure

### 📊 Scoring Rules

**Financial Situation:**
- Investable Assets ranges & points
- Annual Income ranges & points  
- Net Worth ranges & points

**Knowledge & Experience:**
- Years Investing ranges & points
- Education Level points
- Instrument Knowledge multiplier

**Investment Objectives:**
- Time Horizon points (short/medium/long)
- Primary Objective points (growth/income/preservation)

**Risk Tolerance:**
- Risk Level points (aggressive/moderate/conservative)

### 🎯 Risk Levels (1-7)

For each level, configure:
- **Score Range** (min/max)
- **Category Name** (e.g., "Moderate Risk")
- **Allowed Instruments** (select from 17 types)

## Quick Actions

### Save Changes
```
1. Modify any scoring rules or risk levels
2. Click "💾 Save Configuration"
3. Changes apply immediately to all risk calculations
```

### Reset to Defaults
```
1. Click "↺ Reset to Defaults"
2. Confirm
3. All rules return to original values
```

### Reload Configuration
```
1. Click "🔄 Reload"
2. Discards unsaved changes
3. Loads current saved configuration
```

## Example Workflow

### Scenario: Make Level 4 More Conservative

1. Open http://localhost:5001/risk-config.html
2. Scroll to "Level 4: Moderate Risk"
3. Change score range from 40-54 to 45-59
4. Uncheck "stocks" in allowed instruments
5. Click "💾 Save Configuration"
6. ✅ Done! Level 4 is now more conservative

## API Endpoints

```bash
# Get configuration
GET /api/risk-configuration

# Update configuration
PUT /api/risk-configuration

# Reset to defaults
POST /api/risk-configuration/reset
```

## Available Instruments

- stocks
- bonds
- etfs
- mutual_funds
- options
- futures
- commodities
- crypto
- reits
- high_yield_bonds
- bond_funds
- government_bonds
- money_market
- savings
- balanced_funds
- dividend_stocks
- leveraged_etfs

## How It Works

```
Client Answers Questions
         ↓
Dynamic Scoring (uses your configuration)
         ↓
Calculate Total Risk Score
         ↓
Match to Risk Level (uses your thresholds)
         ↓
Return Allowed Instruments (uses your selections)
```

## Key Features

✅ **Real-time Updates** - Changes apply immediately
✅ **Visual Interface** - No code needed
✅ **Flexible Scoring** - Adjust any point value
✅ **Instrument Control** - Select instruments per level
✅ **Easy Testing** - Reload/reset anytime

---

**Full Documentation:** `RISK_CONFIGURATION_GUIDE.md`
