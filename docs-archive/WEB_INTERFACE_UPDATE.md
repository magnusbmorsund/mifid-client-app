# Web Interface Update - Account & Portfolio Endpoints

## Overview

The web API interface at `http://localhost:5001` has been updated to include all the new account and portfolio comparison endpoints.

## New Endpoint Groups

### Accounts
- **POST /api/accounts** - Create/Get Account
- **GET /api/accounts/:id** - Get Account with Portfolios

### Portfolios
- **POST /api/accounts/:id/existing-portfolio** - Upload Existing Portfolio
- **POST /api/portfolios** - Create Proposed Portfolio
- **POST /api/portfolios/compare** - Compare Portfolios

## How to Access

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5001
   ```

3. You'll see the updated interface with new sections:
   - **Accounts** (2 endpoints)
   - **Portfolios** (3 endpoints)

## Testing the New Endpoints

### 1. Create Account
- Click "Create Account" in the Accounts section
- The template is pre-filled with example data
- Replace `paste_client_id_here` with an actual client ID
- Click "Send Request"

### 2. Upload Existing Portfolio
- Click "Upload Existing" in the Portfolios section
- Enter a client ID
- The template shows example holdings with AAPL and MSFT
- Modify as needed and click "Send Request"
- **Note the portfolio ID** from the response

### 3. Create Proposed Portfolio
- Click "Create Proposed" in the Portfolios section
- The template shows a balanced portfolio example
- Replace `paste_client_id_here` with your client ID
- Click "Send Request"
- **Note the portfolio ID** from the response

### 4. Compare Portfolios
- Click "Compare Portfolios" in the Portfolios section
- Replace the placeholder IDs with:
  - `existingPortfolioId`: ID from step 2
  - `proposedPortfolioId`: ID from step 3
- Click "Send Request"
- View the comprehensive comparison results

### 5. Get Account
- Click "Get Account" in the Accounts section
- Enter the client ID
- Click "Send Request"
- See all portfolios linked to the account

## Example Workflow

```
1. Create Client (Client Management section)
   → Get client ID from response

2. Create Account (Accounts section)
   → Use client ID from step 1

3. Upload Existing Portfolio (Portfolios section)
   → Use client ID
   → Get existing portfolio ID from response

4. Create Proposed Portfolio (Portfolios section)
   → Use client ID
   → Get proposed portfolio ID from response

5. Compare Portfolios (Portfolios section)
   → Use both portfolio IDs
   → View detailed comparison
```

## Features

### Pre-filled Templates
All endpoints come with example JSON templates that you can:
- Use as-is for testing
- Modify for your specific needs
- Click "Load Template" to reset

### Response Display
- Color-coded status badges (Success/Error)
- Formatted JSON responses
- Automatic scrolling to response
- Clear button to reset

### Client ID Management
- Automatically saves client ID after creation
- Auto-fills in subsequent requests
- Can be manually updated

## Template Examples

### Upload Existing Portfolio Template
```json
{
  "name": "Current Holdings",
  "holdings": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "quantity": 100,
      "currentValue": 17500,
      "purchasePrice": 150,
      "purchaseDate": "2023-01-15",
      "type": "stocks"
    },
    {
      "symbol": "MSFT",
      "name": "Microsoft Corporation",
      "quantity": 50,
      "currentValue": 18500,
      "type": "stocks"
    }
  ]
}
```

### Compare Portfolios Template
```json
{
  "existingPortfolioId": "paste_existing_portfolio_id_here",
  "proposedPortfolioId": "paste_proposed_portfolio_id_here"
}
```

## Comparison Response Structure

When you compare portfolios, you'll see:

```json
{
  "existing": {
    "id": "...",
    "name": "Current Holdings",
    "totalValue": 36000,
    "holdingsCount": 2
  },
  "proposed": {
    "id": "...",
    "name": "Balanced Growth Portfolio",
    "totalValue": 50000,
    "holdingsCount": 4
  },
  "differences": {
    "valueChange": 14000,
    "valueChangePercent": "38.89",
    "holdingsCountChange": 2
  },
  "holdingsAnalysis": {
    "added": [...],
    "removed": [...],
    "common": [...],
    "addedCount": 3,
    "removedCount": 1,
    "commonCount": 1
  },
  "allocationChanges": [...]
}
```

## Tips

1. **Keep Portfolio IDs**: Copy portfolio IDs from responses for comparison
2. **Use Templates**: Start with pre-filled templates and modify as needed
3. **Check Status**: Green badge = success, Red badge = error
4. **Clear Responses**: Use "Clear Response" button between tests
5. **Browser Console**: Open DevTools (F12) for detailed network info

## Troubleshooting

### "Client ID Required" Error
- Make sure you've created a client first
- Copy the client ID from the response
- Paste it in the Client ID field

### "Portfolio Not Found" Error
- Verify the portfolio IDs are correct
- Check that portfolios were created successfully
- Use "Get Account" to see all portfolio IDs

### Invalid JSON Error
- Check for missing commas
- Ensure all quotes are properly closed
- Use the "Load Template" button to reset

## Next Steps

- Test all endpoints in the web interface
- Use the shell script for automated testing: `./test-account-features.sh`
- Integrate with the React frontend for full workflow
- Review the comparison results format

---

**Updated**: December 10, 2024
**Interface URL**: http://localhost:5001
