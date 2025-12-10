#!/bin/bash

# Test script for Account Structures & Portfolio Comparison features
# This script tests the new API endpoints

API_URL="http://localhost:5001/api"
CLIENT_ID="test_client_$(date +%s)"

echo "=========================================="
echo "Testing Account & Portfolio Features"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Create Account
echo -e "${BLUE}Test 1: Creating Account${NC}"
ACCOUNT_RESPONSE=$(curl -s -X POST "$API_URL/accounts" \
  -H "Content-Type: application/json" \
  -d "{\"clientId\": \"$CLIENT_ID\"}")

if echo "$ACCOUNT_RESPONSE" | grep -q "clientId"; then
  echo -e "${GREEN}✓ Account created successfully${NC}"
  echo "$ACCOUNT_RESPONSE" | jq '.'
else
  echo -e "${RED}✗ Account creation failed${NC}"
  echo "$ACCOUNT_RESPONSE"
  exit 1
fi
echo ""

# Test 2: Upload Existing Portfolio
echo -e "${BLUE}Test 2: Uploading Existing Portfolio${NC}"
EXISTING_PORTFOLIO=$(curl -s -X POST "$API_URL/accounts/$CLIENT_ID/existing-portfolio" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Existing Portfolio",
    "holdings": [
      {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "quantity": 100,
        "currentValue": 17500,
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
  }')

if echo "$EXISTING_PORTFOLIO" | grep -q "portfolio"; then
  echo -e "${GREEN}✓ Existing portfolio uploaded successfully${NC}"
  EXISTING_PORTFOLIO_ID=$(echo "$EXISTING_PORTFOLIO" | jq -r '.portfolio.id')
  echo "Portfolio ID: $EXISTING_PORTFOLIO_ID"
  echo "$EXISTING_PORTFOLIO" | jq '.portfolio'
else
  echo -e "${RED}✗ Existing portfolio upload failed${NC}"
  echo "$EXISTING_PORTFOLIO"
  exit 1
fi
echo ""

# Test 3: Create Proposed Portfolio
echo -e "${BLUE}Test 3: Creating Proposed Portfolio${NC}"
PROPOSED_PORTFOLIO=$(curl -s -X POST "$API_URL/portfolios" \
  -H "Content-Type: application/json" \
  -d "{
    \"clientId\": \"$CLIENT_ID\",
    \"clientName\": \"Test Client\",
    \"name\": \"Test Proposed Portfolio\",
    \"holdings\": [
      {
        \"symbol\": \"AAPL\",
        \"name\": \"Apple Inc.\",
        \"allocation\": 20,
        \"price\": 175,
        \"type\": \"stocks\"
      },
      {
        \"symbol\": \"MSFT\",
        \"name\": \"Microsoft Corporation\",
        \"allocation\": 20,
        \"price\": 370,
        \"type\": \"stocks\"
      },
      {
        \"symbol\": \"SPY\",
        \"name\": \"SPDR S&P 500 ETF\",
        \"allocation\": 30,
        \"price\": 450,
        \"type\": \"etfs\"
      },
      {
        \"symbol\": \"BND\",
        \"name\": \"Vanguard Total Bond Market ETF\",
        \"allocation\": 30,
        \"price\": 75,
        \"type\": \"bonds\"
      }
    ],
    \"totalValue\": 50000,
    \"amountForAdvice\": 50000
  }")

if echo "$PROPOSED_PORTFOLIO" | grep -q "id"; then
  echo -e "${GREEN}✓ Proposed portfolio created successfully${NC}"
  PROPOSED_PORTFOLIO_ID=$(echo "$PROPOSED_PORTFOLIO" | jq -r '.id')
  echo "Portfolio ID: $PROPOSED_PORTFOLIO_ID"
  echo "$PROPOSED_PORTFOLIO" | jq '.'
else
  echo -e "${RED}✗ Proposed portfolio creation failed${NC}"
  echo "$PROPOSED_PORTFOLIO"
  exit 1
fi
echo ""

# Test 4: Get Account with Portfolios
echo -e "${BLUE}Test 4: Retrieving Account with Portfolios${NC}"
ACCOUNT_DATA=$(curl -s -X GET "$API_URL/accounts/$CLIENT_ID")

if echo "$ACCOUNT_DATA" | grep -q "existingPortfolios"; then
  echo -e "${GREEN}✓ Account retrieved successfully${NC}"
  echo "$ACCOUNT_DATA" | jq '.'
else
  echo -e "${RED}✗ Account retrieval failed${NC}"
  echo "$ACCOUNT_DATA"
  exit 1
fi
echo ""

# Test 5: Compare Portfolios
echo -e "${BLUE}Test 5: Comparing Portfolios${NC}"
COMPARISON=$(curl -s -X POST "$API_URL/portfolios/compare" \
  -H "Content-Type: application/json" \
  -d "{
    \"existingPortfolioId\": \"$EXISTING_PORTFOLIO_ID\",
    \"proposedPortfolioId\": \"$PROPOSED_PORTFOLIO_ID\"
  }")

if echo "$COMPARISON" | grep -q "differences"; then
  echo -e "${GREEN}✓ Portfolio comparison successful${NC}"
  echo ""
  echo "=== Comparison Summary ==="
  echo "$COMPARISON" | jq '{
    existing: .existing | {name, totalValue, holdingsCount},
    proposed: .proposed | {name, totalValue, holdingsCount},
    differences: .differences,
    holdingsAnalysis: .holdingsAnalysis | {addedCount, removedCount, commonCount}
  }'
else
  echo -e "${RED}✗ Portfolio comparison failed${NC}"
  echo "$COMPARISON"
  exit 1
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}All Tests Passed Successfully!${NC}"
echo "=========================================="
echo ""
echo "Test Results:"
echo "- Account ID: $CLIENT_ID"
echo "- Existing Portfolio ID: $EXISTING_PORTFOLIO_ID"
echo "- Proposed Portfolio ID: $PROPOSED_PORTFOLIO_ID"
echo ""
echo "You can now test the frontend by:"
echo "1. Starting the backend: cd backend && npm start"
echo "2. Starting the frontend: cd frontend && npm start"
echo "3. Navigate to http://localhost:3000"
echo ""
