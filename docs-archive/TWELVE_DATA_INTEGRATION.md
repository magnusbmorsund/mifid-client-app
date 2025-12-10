# Twelve Data API Integration

## Overview

This application now uses **Twelve Data API** for real-time and historical market data. Twelve Data provides comprehensive coverage of stocks, ETFs, forex, cryptocurrencies, and more.

## API Key Setup

Your API key has been configured in `/backend/.env`:
```
TWELVE_DATA_API_KEY=c0c008526a6b458aa49e905f4f7b1fe2
```

## Free Tier Limits

- **800 API calls per day**
- **8 symbols per request** (batch requests)
- Real-time quotes and historical data
- Support for 10,000+ instruments

## Supported Instruments

### Stocks
- US stocks: `AAPL`, `MSFT`, `GOOGL`, etc.
- Oslo Børs (Norwegian): `EQNR.OL`, `DNB.OL`, `YAR.OL`
- International stocks with exchange suffix

### ETFs
- Major ETFs: `SPY`, `QQQ`, `VOO`, `VTI`
- Bond ETFs: `TLT`, `AGG`, `BND`
- Commodity ETFs: `GLD`, `SLV`, `USO`

### Cryptocurrencies
- Format: `BTC/USD`, `ETH/USD`, `BNB/USD`
- Real-time crypto prices

### Forex
- Currency pairs: `EUR/USD`, `GBP/USD`, etc.

## API Endpoints Used

### 1. Quote Endpoint (`/quote`)
**Purpose:** Get real-time price data for instruments

**Request:**
```javascript
GET https://api.twelvedata.com/quote
?symbol=AAPL,MSFT,GOOGL
&apikey=YOUR_API_KEY
```

**Response:**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc",
  "exchange": "NASDAQ",
  "currency": "USD",
  "close": "182.45",
  "previous_close": "180.23",
  "percent_change": "1.23"
}
```

### 2. Time Series Endpoint (`/time_series`)
**Purpose:** Get historical price data

**Request:**
```javascript
GET https://api.twelvedata.com/time_series
?symbol=AAPL
&interval=1day
&outputsize=365
&apikey=YOUR_API_KEY
```

**Response:**
```json
{
  "meta": {
    "symbol": "AAPL",
    "interval": "1day"
  },
  "values": [
    {
      "datetime": "2024-12-10",
      "open": "180.00",
      "high": "183.00",
      "low": "179.50",
      "close": "182.45",
      "volume": "50000000"
    }
  ]
}
```

## Implementation Details

### Batch Processing
The application processes symbols in batches of 8 to optimize API usage:

```javascript
const batchSize = 8;
const batches = [];

for (let i = 0; i < symbols.length; i += batchSize) {
  batches.push(symbols.slice(i, i + batchSize));
}
```

### Rate Limiting
A 1-second delay is added between batches to respect rate limits:

```javascript
await new Promise(resolve => setTimeout(resolve, 1000));
```

### Error Handling
Each symbol is processed individually with error handling to ensure partial failures don't break the entire request.

## Advantages Over Alpha Vantage

1. **Higher API Limits:** 800 calls/day vs 25 calls/day
2. **Batch Requests:** 8 symbols per request vs 1 symbol per request
3. **Better Coverage:** More international markets and instruments
4. **Cleaner API:** More consistent response format
5. **Crypto Support:** Native cryptocurrency support

## Testing the Integration

### Test Quote Endpoint
```bash
curl "https://api.twelvedata.com/quote?symbol=AAPL&apikey=c0c008526a6b458aa49e905f4f7b1fe2"
```

### Test Time Series Endpoint
```bash
curl "https://api.twelvedata.com/time_series?symbol=AAPL&interval=1day&outputsize=30&apikey=c0c008526a6b458aa49e905f4f7b1fe2"
```

### Test Batch Request
```bash
curl "https://api.twelvedata.com/quote?symbol=AAPL,MSFT,GOOGL&apikey=c0c008526a6b458aa49e905f4f7b1fe2"
```

## Monitoring API Usage

Visit your Twelve Data dashboard to monitor:
- Daily API call usage
- Remaining quota
- Request history
- Error logs

Dashboard: https://twelvedata.com/account/usage

## Troubleshooting

### Common Issues

**1. "API key is invalid"**
- Check that the API key in `.env` matches your Twelve Data account
- Ensure no extra spaces in the `.env` file

**2. "Rate limit exceeded"**
- You've exceeded 800 calls/day
- Wait until the next day or upgrade your plan

**3. "Symbol not found"**
- Verify the symbol format (e.g., `BTC/USD` for crypto, `EQNR.OL` for Oslo Børs)
- Check the symbol exists in Twelve Data's database

**4. "No data returned"**
- Some symbols may not have real-time data
- Try a different time range for historical data

## Upgrading to Paid Plan

If you need more API calls, Twelve Data offers paid plans:
- **Basic:** $49/month - 8,000 calls/day
- **Pro:** $79/month - 16,000 calls/day
- **Ultra:** $129/month - 40,000 calls/day

Visit: https://twelvedata.com/pricing

## Additional Resources

- **API Documentation:** https://twelvedata.com/docs
- **Supported Symbols:** https://twelvedata.com/stocks
- **Support:** support@twelvedata.com
