# ✅ Multi-Tenant Risk Configuration - Quick Summary

## 🌐 Access

**Configuration Interface:** http://localhost:5001/risk-config-multi-tenant.html

## Key Features

### ❌ Financial Situation Removed
- Risk scoring NO LONGER includes income, net worth, or assets
- Only based on: **Knowledge**, **Objectives**, **Risk Tolerance**

### 🏢 Multi-Tenant System
- **Retail Banking** - Conservative, limited instruments
- **Private Banking** - Aggressive, full instrument access
- **Create Custom Tenants** - Add your own segments

### 🎯 Per-Tenant Configuration
- Different scoring rules per tenant
- Different instruments per tenant per risk level
- Example: Private Banking Level 7 has crypto, Retail Level 7 does not

## Quick Actions

### View Tenants
```bash
curl http://localhost:5001/api/tenants
```

### Get Tenant Config
```bash
curl http://localhost:5001/api/risk-configuration/retail
curl http://localhost:5001/api/risk-configuration/private_banking
```

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

### Create New Tenant (via Web Interface)
1. Open http://localhost:5001/risk-config-multi-tenant.html
2. Click "➕ New Tenant"
3. Enter ID, name, description
4. Configure rules and instruments
5. Save

## Example Differences

| Feature | Retail | Private Banking |
|---------|--------|-----------------|
| Level 7 Instruments | 5 | 10 |
| Crypto Access | ❌ No | ✅ Yes (Level 6+) |
| Options/Futures | ❌ No | ✅ Yes (Level 5+) |
| Focus | Conservative | Aggressive |

## Risk Calculation

### What Affects Risk Score
✅ Years investing  
✅ Education level  
✅ Instrument knowledge  
✅ Time horizon  
✅ Investment objective  
✅ Risk tolerance  

### What Does NOT Affect Risk Score
❌ Annual income  
❌ Net worth  
❌ Investable assets  

## Workflow

```
1. Select Tenant (Retail/Private Banking/Custom)
   ↓
2. Configure Scoring Rules
   ↓
3. Set Risk Level Thresholds
   ↓
4. Select Allowed Instruments per Level
   ↓
5. Save Configuration
   ↓
6. Create Clients with Tenant Assignment
   ↓
7. Risk Calculated Using Tenant Rules
```

## API Endpoints

- `GET /api/tenants` - List all tenants
- `GET /api/risk-configuration/:tenant` - Get tenant config
- `PUT /api/risk-configuration/:tenant` - Update tenant config
- `POST /api/risk-configuration/:tenant` - Create new tenant
- `DELETE /api/risk-configuration/:tenant` - Delete tenant
- `POST /api/clients/new` - Create client (with tenant field)

## Files

- **Interface:** `backend/public/risk-config-multi-tenant.html`
- **Documentation:** `MULTI_TENANT_RISK_CONFIG.md`
- **Backend:** `backend/server.js` (updated with multi-tenant logic)

---

**Full Documentation:** `MULTI_TENANT_RISK_CONFIG.md`
