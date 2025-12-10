# Web Interface Guide

## 🎉 API Web Interface is Live!

You now have a beautiful, interactive web interface for testing all your API endpoints.

## Access the Interface

**URL:** http://localhost:5001/

Simply open your browser and navigate to the URL above.

## Features

### ✨ **Interactive UI**
- Beautiful, modern design with gradient background
- Sidebar navigation for all endpoints
- Real-time request/response display
- Syntax-highlighted JSON

### 📝 **Pre-filled Templates**
- Every endpoint has example JSON templates
- Click "Load Template" to populate with sample data
- Edit JSON directly in the interface

### 🔄 **Auto Client ID Management**
- When you create a client, the ID is automatically saved
- Client ID auto-fills for subsequent requests
- No need to copy/paste IDs manually

### 📊 **Visual Feedback**
- Color-coded HTTP methods (POST, GET, DELETE)
- Success/Error status badges
- Loading spinner during requests
- Formatted JSON responses

## How to Use

### 1. **Create a New Client**
- Interface opens with "Create Client" endpoint selected
- Template is already loaded
- Click "Send Request"
- Client ID is automatically saved

### 2. **Update Client Profile**
- Select any profile update endpoint from sidebar
- Client ID is auto-filled from previous step
- Edit the JSON template as needed
- Click "Send Request"
- See the updated risk profile in response

### 3. **Get Instruments**
- Select "Filter Instruments" endpoint
- Adjust risk level and allowed instruments
- Click "Send Request"
- See real-time market data with prices

### 4. **View Historical Data**
- Select "Historical Data" endpoint
- Enter stock symbols (e.g., AAPL, MSFT)
- Choose time range (1mo, 3mo, 6mo, 1y, 5y)
- Click "Send Request"
- See normalized returns data

## Available Endpoints

### Client Management
- ✅ **Create Client** - Create new client with basic info
- ✅ **Get All Clients** - List all clients with risk profiles
- ✅ **Get Client** - Get specific client details
- ✅ **Delete Client** - Remove a client

### Profile Updates (Auto-recalculate risk)
- ✅ **Personal Info** - Update contact details
- ✅ **Financial Situation** - Update income, assets, net worth
- ✅ **Knowledge & Experience** - Update investment experience
- ✅ **Objectives** - Update investment goals
- ✅ **Risk Tolerance** - Update risk preferences
- ✅ **Sustainability** - Update ESG preferences

### Market Data
- ✅ **Filter Instruments** - Get instruments by risk profile
- ✅ **Historical Data** - Get price history

## Example Workflow

### Complete Client Onboarding

1. **Create Client**
   ```
   Endpoint: Create Client
   Action: Click "Send Request"
   Result: Client created with ID
   ```

2. **Add Financial Data**
   ```
   Endpoint: Financial Situation
   Edit: annualIncome, netWorth, investableAssets
   Action: Click "Send Request"
   Result: Risk profile calculated
   ```

3. **Add Investment Knowledge**
   ```
   Endpoint: Knowledge & Experience
   Edit: yearsInvesting, educationLevel
   Action: Click "Send Request"
   Result: Risk profile updated
   ```

4. **Set Investment Goals**
   ```
   Endpoint: Objectives
   Edit: primaryObjective, timeHorizon
   Action: Click "Send Request"
   Result: Risk profile finalized
   ```

5. **Get Suitable Instruments**
   ```
   Endpoint: Filter Instruments
   Use: Risk level from client profile
   Action: Click "Send Request"
   Result: List of suitable investments
   ```

## Tips & Tricks

### 💡 **Quick Testing**
- Templates are pre-loaded for all endpoints
- Just click "Send Request" to test immediately
- No need to write JSON from scratch

### 💡 **Partial Updates**
- You can send only the fields you want to update
- Remove unwanted fields from the JSON
- Example: Update only phone number

### 💡 **Copy Client IDs**
- Use "Get All Clients" to see all client IDs
- Copy the ID you want to work with
- Paste into the Client ID field

### 💡 **JSON Validation**
- Invalid JSON shows clear error messages
- Use the templates as a guide
- Check for missing commas, quotes, brackets

### 💡 **Response Analysis**
- Responses are formatted and syntax-highlighted
- Success responses show green badge
- Error responses show red badge
- Status codes are displayed

## Keyboard Shortcuts

- **Ctrl/Cmd + A** - Select all in JSON editor
- **Ctrl/Cmd + C** - Copy JSON
- **Ctrl/Cmd + V** - Paste JSON

## Troubleshooting

### Issue: "Cannot POST /api/..."
**Solution:** Make sure the backend server is running on port 5001

### Issue: "Client not found"
**Solution:** Create a client first or check the Client ID

### Issue: "Invalid JSON"
**Solution:** Check for syntax errors in your JSON (missing commas, quotes, brackets)

### Issue: "CORS error"
**Solution:** The server has CORS enabled, but ensure you're accessing from localhost

## Technical Details

### Architecture
- **Frontend:** Pure HTML/CSS/JavaScript (no frameworks)
- **Backend:** Express.js REST API
- **Data:** In-memory storage (resets on server restart)
- **API:** Twelve Data for market data

### File Location
```
backend/public/api-interface.html
```

### Server Configuration
```javascript
// Serves the interface at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'api-interface.html'));
});
```

## Customization

### Change Colors
Edit the CSS variables in `api-interface.html`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add New Endpoints
Add to the `endpoints` object in the JavaScript:
```javascript
endpoints.myNewEndpoint = {
    title: 'My New Endpoint',
    method: 'POST',
    url: '/my-endpoint',
    description: 'Description here',
    template: { /* JSON template */ }
};
```

## Security Notes

⚠️ **Development Only**
- This interface is for development/testing
- No authentication implemented
- Not suitable for production without security

⚠️ **Production Recommendations**
- Add authentication (JWT, OAuth)
- Implement rate limiting
- Add input validation
- Use HTTPS
- Add API key management

## Next Steps

1. ✅ **Test all endpoints** using the interface
2. ✅ **Create sample clients** with different risk profiles
3. ✅ **Explore market data** with real-time prices
4. ✅ **Build complete workflows** from client creation to portfolio
5. ✅ **Integrate with your frontend** application

## Support

- **API Documentation:** `API_DOCUMENTATION.md`
- **Endpoint Summary:** `API_ENDPOINTS_SUMMARY.md`
- **Test Script:** `test-api.sh`

---

**Enjoy your new API interface!** 🚀

Access it now at: **http://localhost:5001/**
