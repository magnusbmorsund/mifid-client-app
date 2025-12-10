# Alpha Vantage API Setup Guide

## Why Alpha Vantage?

We've migrated from Yahoo Finance to Alpha Vantage because:
- ✅ More reliable (no 404 errors)
- ✅ Better data quality
- ✅ Extensive coverage (stocks, ETFs, bonds, mutual funds, crypto)
- ✅ Free tier with 25 API calls per day
- ✅ Good international market coverage

## Quick Setup (5 minutes)

### Step 1: Get Your Free API Key

1. Visit: https://www.alphavantage.co/support/#api-key
2. Enter your email address
3. You'll receive your API key instantly (no verification needed)
4. Copy the API key

### Step 2: Configure Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your API key:
   ```
   PORT=5001
   ALPHA_VANTAGE_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```

### Step 3: Restart Backend

```bash
npm start
```

That's it! Your app now uses Alpha Vantage.

## API Rate Limits

**Free Tier:**
- 25 API calls per day
- 5 API calls per minute

**What this means for your app:**
- Fetching instruments: 1 call per symbol
- Historical data: 1 call per symbol
- With 10 instruments selected, you'll use ~20 calls for the chart

**Tips to stay within limits:**
- The app caches data during the session
- Historical data is only fetched when viewing the chart
- Consider upgrading to premium if you need more calls

## Supported Instruments

Alpha Vantage supports:
- ✅ US Stocks (AAPL, MSFT, GOOGL, etc.)
- ✅ ETFs (SPY, VOO, QQQ, etc.)
- ✅ Mutual Funds
- ✅ Bonds (TLT, AGG, BND, etc.)
- ✅ Cryptocurrencies (BTC-USD, ETH-USD, etc.)
- ✅ Commodities (GLD, SLV, etc.)
- ⚠️ Limited support for non-US stocks (Oslo Børs symbols may not work)

## Troubleshooting

### "No data available" error
- Check your API key is correct in `.env`
- Verify you haven't exceeded rate limits (25 calls/day)
- Some symbols may not be available in Alpha Vantage

### Rate limit exceeded
- Wait until the next day (resets at midnight UTC)
- Or upgrade to premium plan at https://www.alphavantage.co/premium/

### Slow response times
- Alpha Vantage can be slower than Yahoo Finance
- Historical data fetching takes 2-3 seconds per symbol
- This is normal for the free tier

## Alternative: Using Demo Key

If you don't want to sign up, you can use the demo key:
```
ALPHA_VANTAGE_API_KEY=demo
```

**Note:** Demo key only works with IBM stock symbol and has severe rate limits.

## Upgrading to Premium

If you need more API calls:
- Visit: https://www.alphavantage.co/premium/
- Plans start at $49.99/month
- Get 75-1200 calls per minute depending on plan

## Need Help?

- Alpha Vantage Documentation: https://www.alphavantage.co/documentation/
- Support: https://www.alphavantage.co/support/

---

**Note:** The backend code automatically handles API responses and errors, so you don't need to modify any code beyond setting up the API key.
