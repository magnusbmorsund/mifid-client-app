# API Quick Reference Card

## 🎯 Hybrid API Setup

### Finnhub → Real-Time Quotes
- **60 calls/minute** (~86,400/day)
- 15-min delayed prices
- `/api/instruments/filter`

### Twelve Data → Historical Charts
- **800 calls/day**
- Full historical data
- `/api/instruments/historical`

## 🔑 API Keys

```bash
FINNHUB_API_KEY=d4sk461r01qvsjbi9d6gd4sk461r01qvsjbi9d70
TWELVE_DATA_API_KEY=c0c008526a6b458aa49e905f4f7b1fe2
```

## 🚀 Quick Test

### Real-Time Quotes (Finnhub)
```bash
curl -X POST http://localhost:5001/api/instruments/filter \
  -H "Content-Type: application/json" \
  -d '{"riskLevel": 4, "allowedInstruments": ["stocks"]}'
```

### Historical Data (Twelve Data)
```bash
curl -X POST http://localhost:5001/api/instruments/historical \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["AAPL"], "range": "1mo"}'
```

## 🌐 Web Interface

**URL:** http://localhost:5001/

## 📊 Status

✅ Finnhub: Working (Real-time quotes)
✅ Twelve Data: Working (Historical data)
✅ Web Interface: Live
✅ All Endpoints: Functional

## 💰 Cost

**Total:** $0/month (both free tiers)

## 📈 Capacity

- **Quotes:** ~86,400/day
- **Historical:** 800/day
- **Perfect for:** 50+ clients/day
