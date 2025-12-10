# API Security Setup Guide

## Overview

The MiFID II backend now requires API key authentication for all POST endpoints that create or modify data. This prevents unauthorized access and tracks API usage per client.

---

## Quick Start

### 1. Generate an API Key

```bash
cd backend
node generateApiKey.js "Your Company Name"
```

**Example Output:**
```
✅ API Key Generated Successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client Name:  Your Company Name
Client ID:    client_1733841234567_a1b2c3d4
API Key:      64characterhexadecimalstringhere...
Created:      2024-12-10T12:00:00.000Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANT: Save this API key securely. It will not be shown again.
```

### 2. Configure Frontend

Create `/frontend/.env` file:
```bash
cd frontend
cp .env.example .env
```

Edit `.env` and add your API key:
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_API_KEY=your_api_key_from_step_1
```

### 3. Restart Applications

```bash
# Backend (if running)
cd backend
npm start

# Frontend
cd frontend
npm start
```

---

## API Key Management

### List All API Keys

```bash
node manageApiKeys.js list
```

**Output:**
```
📋 API Keys List

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Acme Financial Services
   Client ID:    client_1733841234567_a1b2c3d4
   API Key:      64characterhexad...c3d4e5f6
   Status:       ✅ Active
   Created:      12/10/2024, 12:00:00 PM
   Last Used:    12/10/2024, 12:30:00 PM
   Requests:     42

2. Beta Investment Corp
   Client ID:    client_1733841298765_b2c3d4e5
   API Key:      64characterhexad...d4e5f6g7
   Status:       ❌ Revoked
   Created:      12/10/2024, 11:00:00 AM
   Last Used:    Never
   Requests:     0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total: 2 API key(s) | Active: 1 | Revoked: 1
```

### Revoke an API Key

```bash
node manageApiKeys.js revoke [api-key]
```

**Example:**
```bash
node manageApiKeys.js revoke 64characterhexadecimalstringhere...
```

### Activate a Revoked Key

```bash
node manageApiKeys.js activate [api-key]
```

### View Usage Statistics

```bash
node manageApiKeys.js stats
```

**Output:**
```
📊 API Usage Statistics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total API Keys:        5
Active Keys:           4
Revoked Keys:          1
Keys Ever Used:        3
Total Requests:        1,247
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Top 5 Most Used Keys:

1. Acme Financial Services
   Requests: 842
   Last Used: 12/10/2024, 2:30:00 PM

2. Beta Investment Corp
   Requests: 305
   Last Used: 12/10/2024, 1:15:00 PM
```

---

## Protected Endpoints

The following endpoints now require API key authentication:

### Client Management
- `POST /api/clients` - Create client
- `POST /api/clients/new` - Create minimal client
- `POST /api/clients/:id/personal-info` - Update personal info
- `POST /api/clients/:id/financial-situation` - Update financial situation
- `POST /api/clients/:id/knowledge-experience` - Update knowledge
- `POST /api/clients/:id/objectives` - Update objectives
- `POST /api/clients/:id/risk-tolerance` - Update risk tolerance
- `POST /api/clients/:id/sustainability` - Update sustainability

### Portfolio Management
- `POST /api/portfolios` - Create portfolio
- `POST /api/accounts` - Create account
- `POST /api/accounts/:clientId/existing-portfolio` - Upload existing portfolio

### Public Endpoints (No Auth Required)
- `GET /api/clients` - List clients
- `GET /api/clients/:id` - Get client
- `POST /api/instruments/filter` - Filter instruments
- `POST /api/portfolios/compare` - Compare portfolios
- `GET /api/risk-configuration` - Get risk config

---

## Using the API

### With curl

```bash
curl -X POST http://localhost:5001/api/clients \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "personalInfo": {
      "name": "John Doe",
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
    }
  }'
```

### With JavaScript/Axios

```javascript
import axios from 'axios';

// Set default header
axios.defaults.headers.common['X-API-Key'] = 'your_api_key_here';

// Make request
const response = await axios.post('http://localhost:5001/api/clients', {
  personalInfo: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  // ... rest of data
});
```

### With Postman

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:5001/api/clients`
4. Headers tab:
   - Key: `X-API-Key`
   - Value: `your_api_key_here`
5. Body tab:
   - Select "raw" and "JSON"
   - Add your request body
6. Send

---

## Error Responses

### Missing API Key (401)

```json
{
  "error": "Authentication required",
  "message": "API key is missing. Please provide X-API-Key header.",
  "documentation": "Run \"node generateApiKey.js [client-name]\" to generate an API key"
}
```

### Invalid API Key (401)

```json
{
  "error": "Invalid API key",
  "message": "The provided API key is not valid.",
  "documentation": "Contact administrator for a valid API key"
}
```

### Revoked API Key (403)

```json
{
  "error": "API key revoked",
  "message": "This API key has been revoked and is no longer valid.",
  "revokedAt": "2024-12-10T12:00:00.000Z",
  "documentation": "Contact administrator for a new API key"
}
```

### Rate Limit Exceeded (429)

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

---

## Rate Limiting

Each API key is limited to:
- **100 requests per minute**
- Limits are per API key, not per IP
- Rate limit headers included in response:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: When the limit resets

---

## Security Features

### 1. **Secure Key Generation**
- 64-character hexadecimal keys
- Cryptographically secure random generation
- Unique per client

### 2. **Usage Tracking**
- Request count per key
- Last used timestamp
- Automatic statistics

### 3. **Key Management**
- Activate/revoke keys
- List all keys
- View usage statistics

### 4. **Rate Limiting**
- Per-key rate limits
- Prevents API abuse
- Automatic reset

### 5. **Request Validation**
- Size limits (10MB)
- Header validation
- Active key verification

---

## File Structure

```
backend/
├── generateApiKey.js          # Generate new API keys
├── manageApiKeys.js           # Manage existing keys
├── authMiddleware.js          # Authentication logic
├── api-keys.json              # Stored API keys (auto-created)
└── server.js                  # Main server (updated)

frontend/
├── .env                       # Environment variables (create this)
├── .env.example               # Example env file
└── src/
    └── App.js                 # Updated with API key config
```

---

## Production Deployment

### Environment Variables

**Backend** (`/backend/.env`):
```
PORT=5001
NODE_ENV=production
FINNHUB_API_KEY=your_real_key
TWELVE_DATA_API_KEY=your_real_key
EODHD_API_KEY=your_real_key
FRONTEND_URL=https://your-domain.com
```

**Frontend** (`/frontend/.env.production`):
```
REACT_APP_API_URL=https://api.your-domain.com/api
REACT_APP_API_KEY=your_production_api_key
```

### Security Checklist

- [ ] Generate production API keys
- [ ] Store keys securely (environment variables, secrets manager)
- [ ] Never commit `.env` files to git
- [ ] Use HTTPS in production
- [ ] Backup `api-keys.json` regularly
- [ ] Monitor API usage
- [ ] Rotate keys periodically
- [ ] Revoke unused keys

---

## Troubleshooting

### "Authentication required" error

**Cause**: API key not provided
**Solution**: Add `X-API-Key` header to request

### "Invalid API key" error

**Cause**: API key doesn't exist
**Solution**: Generate new key with `node generateApiKey.js`

### "API key revoked" error

**Cause**: Key was revoked
**Solution**: Activate key or generate new one

### Frontend can't connect

**Cause**: Missing `.env` file or wrong API key
**Solution**: 
1. Create `/frontend/.env`
2. Add correct API key
3. Restart frontend

### Rate limit errors

**Cause**: Too many requests
**Solution**: 
1. Wait for rate limit reset
2. Implement request throttling
3. Contact admin for higher limits

---

## Best Practices

### 1. **One Key Per Client**
Generate separate keys for each client/application

### 2. **Rotate Keys Regularly**
Generate new keys every 90 days

### 3. **Monitor Usage**
Check statistics regularly for unusual activity

### 4. **Revoke Unused Keys**
Remove keys that haven't been used in 30+ days

### 5. **Secure Storage**
- Never hardcode keys in code
- Use environment variables
- Use secrets management in production

### 6. **Backup Keys**
Regularly backup `api-keys.json`

---

## Support

### Generate Key
```bash
node generateApiKey.js "Client Name"
```

### List Keys
```bash
node manageApiKeys.js list
```

### Get Help
```bash
node manageApiKeys.js
# Shows all available commands
```

---

## Summary

✅ **API keys required** for all POST endpoints
✅ **Easy generation** with command-line tool
✅ **Usage tracking** and statistics
✅ **Rate limiting** per key
✅ **Revoke/activate** keys as needed
✅ **Frontend integration** via environment variables

**Security Status**: 🔒 Secured with API key authentication

---

**Updated**: December 10, 2024
**Version**: 1.0.0
