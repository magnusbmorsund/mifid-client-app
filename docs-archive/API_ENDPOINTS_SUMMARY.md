# API Endpoints Summary

## ✅ New Granular API Endpoints Created

Your MiFID II application now has comprehensive API endpoints for programmatic client profile management.

## Quick Reference

### Client Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/clients/new` | Create new client (requires: firstName, lastName, email) |
| `GET` | `/api/clients` | Get all clients |
| `GET` | `/api/clients/:id` | Get specific client |
| `DELETE` | `/api/clients/:id` | Delete client |

### Granular Profile Updates (All auto-recalculate risk profile)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/clients/:id/personal-info` | Update personal information |
| `POST` | `/api/clients/:id/financial-situation` | Update financial data |
| `POST` | `/api/clients/:id/knowledge-experience` | Update investment knowledge |
| `POST` | `/api/clients/:id/objectives` | Update investment objectives |
| `POST` | `/api/clients/:id/risk-tolerance` | Update risk tolerance |
| `POST` | `/api/clients/:id/sustainability` | Update ESG preferences |

### Portfolio & Market Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/portfolios` | Create portfolio |
| `GET` | `/api/portfolios/:clientId` | Get client portfolios |
| `POST` | `/api/instruments/filter` | Get instruments by risk profile |
| `POST` | `/api/instruments/historical` | Get historical price data |

## Key Features

### 1. **Partial Updates**
All endpoints support partial updates - send only the fields you want to change:
```bash
# Only update phone number
curl -X POST http://localhost:5001/api/clients/123/personal-info \
  -H "Content-Type: application/json" \
  -d '{"phone": "+47 987 65 432"}'
```

### 2. **Automatic Risk Recalculation**
Risk profile is automatically recalculated when you update:
- Financial situation
- Knowledge & experience
- Investment objectives
- Risk tolerance
- Sustainability preferences

### 3. **MiFID II Compliant**
All endpoints follow MiFID II requirements for:
- Appropriateness assessment
- Suitability assessment
- Sustainability preferences (SFDR)

## Quick Start

### 1. Create a Client
```bash
curl -X POST http://localhost:5001/api/clients/new \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }'
```

**Response:**
```json
{
  "message": "Client created successfully",
  "client": {
    "id": "1702123456789",
    "personalInfo": { ... }
  }
}
```

### 2. Update Financial Situation
```bash
curl -X POST http://localhost:5001/api/clients/1702123456789/financial-situation \
  -H "Content-Type: application/json" \
  -d '{
    "annualIncome": 750000,
    "netWorth": 3500000,
    "investableAssets": 1500000
  }'
```

**Response:**
```json
{
  "message": "Financial situation updated successfully",
  "financialSituation": { ... },
  "riskProfile": {
    "riskScore": 68,
    "riskLevel": 5,
    "riskCategory": "Moderate-High Risk"
  }
}
```

### 3. Get Suitable Instruments
```bash
curl -X POST http://localhost:5001/api/instruments/filter \
  -H "Content-Type: application/json" \
  -d '{
    "riskLevel": 5,
    "allowedInstruments": ["stocks", "etfs", "bonds"]
  }'
```

**Response:**
```json
{
  "riskLevel": 5,
  "totalInstruments": 25,
  "instruments": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc",
      "price": 182.45,
      "change": "-0.26"
    }
  ]
}
```

## Testing

### Run the Test Script
```bash
cd /Users/magnusberntzenmorsund/Desktop/mifid-client-app
./test-api.sh
```

This will:
1. ✅ Create a new client
2. ✅ Update financial situation
3. ✅ Update knowledge & experience
4. ✅ Update investment objectives
5. ✅ Update risk tolerance
6. ✅ Update sustainability preferences
7. ✅ Retrieve complete profile with risk assessment
8. ✅ Get suitable instruments
9. ✅ Get historical data
10. ✅ List all clients

### Manual Testing Examples

**Create Client:**
```bash
curl -X POST http://localhost:5001/api/clients/new \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Test", "lastName": "User", "email": "test@example.com"}'
```

**Update Knowledge:**
```bash
curl -X POST http://localhost:5001/api/clients/YOUR_CLIENT_ID/knowledge-experience \
  -H "Content-Type: application/json" \
  -d '{"yearsInvesting": 5, "educationLevel": "university"}'
```

**Get Client:**
```bash
curl http://localhost:5001/api/clients/YOUR_CLIENT_ID | jq
```

## Documentation

- **Full API Documentation:** `API_DOCUMENTATION.md`
- **Test Script:** `test-api.sh`
- **Twelve Data Integration:** `TWELVE_DATA_INTEGRATION.md`

## Use Cases

### 1. **External System Integration**
Integrate with CRM, onboarding systems, or compliance platforms:
```javascript
// Create client from CRM data
const response = await fetch('http://localhost:5001/api/clients/new', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: crmData.firstName,
    lastName: crmData.lastName,
    email: crmData.email
  })
});
```

### 2. **Progressive Profiling**
Build client profile step-by-step through multiple interactions:
```javascript
// Step 1: Create client
const client = await createClient(basicInfo);

// Step 2: Add financial data (later)
await updateFinancialSituation(client.id, financialData);

// Step 3: Add investment knowledge (later)
await updateKnowledge(client.id, knowledgeData);
```

### 3. **Automated Risk Assessment**
Automatically assess risk and get suitable instruments:
```javascript
// Update client data
await updateFinancialSituation(clientId, financialData);
await updateKnowledge(clientId, knowledgeData);

// Get updated risk profile
const client = await getClient(clientId);

// Get suitable instruments
const instruments = await filterInstruments({
  riskLevel: client.riskProfile.riskLevel,
  allowedInstruments: client.riskProfile.allowedInstruments
});
```

### 4. **Compliance Reporting**
Generate MiFID II compliant reports:
```javascript
// Get all clients with risk profiles
const clients = await getAllClients();

// Generate compliance report
const report = clients.map(client => ({
  name: `${client.personalInfo.firstName} ${client.personalInfo.lastName}`,
  riskCategory: client.riskProfile.riskCategory,
  assessmentDate: client.updatedAt,
  allowedInstruments: client.riskProfile.allowedInstruments
}));
```

## Response Format

All endpoints return JSON with consistent structure:

**Success Response:**
```json
{
  "message": "Operation successful",
  "data": { ... },
  "clientId": "1702123456789"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

## Status Codes

- `200 OK` - Successful GET/POST/DELETE
- `201 Created` - New resource created
- `400 Bad Request` - Missing or invalid data
- `404 Not Found` - Client not found
- `500 Internal Server Error` - Server error

## Next Steps

1. **Test the endpoints** using the provided test script
2. **Review API_DOCUMENTATION.md** for detailed examples
3. **Integrate with your frontend** or external systems
4. **Add database persistence** for production use
5. **Implement authentication** for security

## Files Created

- ✅ `backend/server.js` - Updated with new endpoints
- ✅ `API_DOCUMENTATION.md` - Complete API reference
- ✅ `API_ENDPOINTS_SUMMARY.md` - This file
- ✅ `test-api.sh` - Automated test script

## Support

For questions or issues:
1. Check `API_DOCUMENTATION.md` for detailed examples
2. Run `./test-api.sh` to see working examples
3. Review the code in `backend/server.js` (lines 310-573)

---

**Ready to use!** 🚀

The backend server is already running on port 5001. Start testing with:
```bash
./test-api.sh
```
