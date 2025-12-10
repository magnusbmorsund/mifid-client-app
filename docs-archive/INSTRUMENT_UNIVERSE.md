# Instrument Universe - Alpha Vantage Compatible

## Overview

The instrument universe has been optimized for **Alpha Vantage Free Tier** compatibility. The free tier works best with major US stocks and has limited support for ETFs, bonds, and international securities.

## ✅ Fully Supported Instruments (Confirmed Working)

### **Large Cap US Stocks** (Best Performance)
These work perfectly with Alpha Vantage free tier:

- **Technology:** AAPL, MSFT, GOOGL, AMZN, NVDA, META, IBM, INTC, AMD
- **Finance:** JPM, BAC, C (Citigroup)
- **Consumer:** WMT, DIS, NFLX, KO, PEP, MCD, PG
- **Healthcare:** JNJ, PFE
- **Telecom:** VZ, T (AT&T)
- **Energy:** XOM, CVX
- **Industrial:** GE, F (Ford)
- **Real Estate (REITs):** O (Realty Income), SPG, VNO, PSA

### **Cryptocurrencies**
- BTC-USD (Bitcoin)
- ETH-USD (Ethereum)

## ⚠️ Limited Support

### **ETFs** (May work but not guaranteed)
- SPY, QQQ, DIA, IWM
- GLD, SLV (Commodities)
- TLT, IEF, SHY (Treasuries)
- BND, AGG (Bonds)
- HYG, JNK (High Yield)

**Note:** ETF support is inconsistent on free tier. Some may return "No data available."

## ❌ Not Supported on Free Tier

- **Oslo Børs stocks** (EQNR.OL, DNB.OL, etc.)
- **Most international stocks**
- **Mutual funds** (VFIAX, FXAIX, etc.)
- **Most bonds** (individual bonds)

## Current Instrument Mapping by Risk Category

### **Very Low Risk (Level 1)**
- **Government Bonds:** TLT, IEF, SHY
- **Money Market Alternatives:** MSFT, AAPL, JNJ (ultra-stable stocks)
- **Savings Alternatives:** JNJ, PG, KO (defensive stocks)

### **Low Risk (Level 2)**
- **Bond Funds:** BND, AGG, TLT
- **Dividend Stocks:** VZ, T, XOM, CVX, PFE

### **Low-Moderate Risk (Level 3)**
- **Balanced Funds:** KO, PEP, JNJ, PG, MCD (consumer staples)
- **Dividend Stocks:** VZ, T, XOM, CVX, PFE
- **ETFs:** SPY, DIA

### **Moderate Risk (Level 4)**
- **Stocks:** AAPL, MSFT, JPM, BAC, WMT, DIS
- **ETFs:** SPY, QQQ, DIA
- **Bonds:** TLT, BND, AGG
- **Balanced Funds:** KO, PEP, JNJ, PG, MCD

### **Moderate-High Risk (Level 5)**
- **Stocks:** AAPL, MSFT, GOOGL, AMZN, NVDA, META, IBM, JPM, BAC, WMT, DIS, NFLX, INTC, AMD
- **ETFs:** SPY, QQQ, DIA, IWM
- **Bonds:** TLT, IEF, SHY
- **REITs:** O, SPG, VNO, PSA

### **High Risk (Level 6)**
- **Stocks:** All major tech and growth stocks
- **Commodities:** GLD, SLV
- **High Yield Bonds:** HYG, JNK
- **Options:** (Not yet implemented)

### **Very High Risk (Level 7)**
- **All stocks**
- **Crypto:** BTC-USD, ETH-USD
- **Commodities:** GLD, SLV
- **Leveraged ETFs:** (Not yet implemented)
- **Options & Futures:** (Not yet implemented)

## Recommended Portfolios by Risk Level

### **Conservative Portfolio (Level 1-2)**
- 40% JNJ (Healthcare - defensive)
- 30% PG (Consumer staples)
- 20% KO (Beverages)
- 10% MSFT (Tech - stable)

### **Moderate Portfolio (Level 3-4)**
- 25% AAPL (Tech)
- 25% MSFT (Tech)
- 20% JPM (Finance)
- 15% JNJ (Healthcare)
- 15% KO (Consumer)

### **Growth Portfolio (Level 5-6)**
- 20% NVDA (Tech - AI)
- 20% GOOGL (Tech)
- 15% AMZN (E-commerce)
- 15% META (Social Media)
- 15% MSFT (Cloud)
- 15% AAPL (Consumer Tech)

### **Aggressive Portfolio (Level 7)**
- 25% TSLA (EV/Tech)
- 20% NVDA (AI/Chips)
- 15% BTC-USD (Crypto)
- 15% ETH-USD (Crypto)
- 10% AMD (Chips)
- 10% META (Social)
- 5% GLD (Hedge)

## Testing Instruments

To test if a symbol works with your API key:

```bash
curl "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=YOUR_KEY"
```

If you get valid data, the symbol works. If you get an error or empty data, it's not supported.

## Adding New Instruments

To add new instruments, edit `backend/server.js`:

```javascript
const instrumentUniverse = {
  stocks: ['AAPL', 'MSFT', 'YOUR_SYMBOL'],
  // ... other categories
};
```

**Important:** Only add symbols you've tested and confirmed work with Alpha Vantage free tier.

## Upgrading for More Instruments

If you need:
- International stocks (Oslo Børs, LSE, etc.)
- More ETFs and mutual funds
- Real-time data
- More API calls

Consider upgrading to **Alpha Vantage Premium**:
- Plans start at $49.99/month
- 75-1200 calls per minute
- Full instrument coverage
- Visit: https://www.alphavantage.co/premium/

## Alternative: Using Multiple Data Sources

For a production system, consider implementing a hybrid approach:
1. **Alpha Vantage** for US stocks
2. **Yahoo Finance** as fallback (less reliable but free)
3. **Twelve Data** for international markets (free tier: 800 calls/day)
4. **IEX Cloud** for real-time US data

---

**Last Updated:** December 2025  
**API Tier:** Alpha Vantage Free (25 calls/day)
