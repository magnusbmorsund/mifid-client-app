#!/bin/bash

# MiFID II API Test Script
# This script demonstrates how to use the granular API endpoints

BASE_URL="http://localhost:5001/api"

echo "========================================="
echo "MiFID II Client Profiling API Test"
echo "========================================="
echo ""

# Step 1: Create a new client
echo "1. Creating new client..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/clients/new \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Emma",
    "lastName": "Johnson",
    "email": "emma.johnson@example.com",
    "phone": "+47 123 45 678",
    "dateOfBirth": "1988-03-20",
    "nationality": "Norwegian"
  }')

CLIENT_ID=$(echo $CREATE_RESPONSE | jq -r '.client.id')
echo "✅ Client created with ID: $CLIENT_ID"
echo ""

# Step 2: Update financial situation
echo "2. Updating financial situation..."
curl -s -X POST $BASE_URL/clients/$CLIENT_ID/financial-situation \
  -H "Content-Type: application/json" \
  -d '{
    "annualIncome": 850000,
    "netWorth": 4200000,
    "investableAssets": 2000000,
    "employmentStatus": "employed_full_time",
    "sourceOfWealth": "salary_and_investments"
  }' | jq '{message, riskProfile: .riskProfile.riskCategory}'
echo ""

# Step 3: Update knowledge & experience
echo "3. Updating knowledge & experience..."
curl -s -X POST $BASE_URL/clients/$CLIENT_ID/knowledge-experience \
  -H "Content-Type: application/json" \
  -d '{
    "yearsInvesting": 10,
    "educationLevel": "finance_degree",
    "instrumentKnowledge": [
      {"instrument": "stocks", "knowledge": "expert"},
      {"instrument": "bonds", "knowledge": "experienced"},
      {"instrument": "etfs", "knowledge": "expert"},
      {"instrument": "options", "knowledge": "experienced"}
    ],
    "tradingFrequency": "weekly",
    "professionalExperience": true
  }' | jq '{message, riskProfile: .riskProfile.riskCategory}'
echo ""

# Step 4: Update investment objectives
echo "4. Updating investment objectives..."
curl -s -X POST $BASE_URL/clients/$CLIENT_ID/objectives \
  -H "Content-Type: application/json" \
  -d '{
    "primaryObjective": "growth",
    "timeHorizon": "long",
    "liquidityNeeds": "low",
    "expectedReturn": 10,
    "investmentAmount": 1500000
  }' | jq '{message, riskProfile: .riskProfile.riskCategory}'
echo ""

# Step 5: Update risk tolerance
echo "5. Updating risk tolerance..."
curl -s -X POST $BASE_URL/clients/$CLIENT_ID/risk-tolerance \
  -H "Content-Type: application/json" \
  -d '{
    "level": "aggressive",
    "maxDrawdown": 30,
    "volatilityComfort": "high",
    "lossReaction": "hold_and_wait"
  }' | jq '{message, riskProfile: .riskProfile.riskCategory}'
echo ""

# Step 6: Update sustainability preferences
echo "6. Updating sustainability preferences..."
curl -s -X POST $BASE_URL/clients/$CLIENT_ID/sustainability \
  -H "Content-Type: application/json" \
  -d '{
    "esgImportance": "important",
    "excludeSectors": ["tobacco", "weapons", "fossil_fuels"],
    "preferredSectors": ["renewable_energy", "technology"],
    "esgMinRating": 7
  }' | jq '{message}'
echo ""

# Step 7: Get complete client profile
echo "7. Retrieving complete client profile..."
curl -s $BASE_URL/clients/$CLIENT_ID | jq '{
  id,
  name: (.personalInfo.firstName + " " + .personalInfo.lastName),
  email: .personalInfo.email,
  riskProfile: {
    score: .riskProfile.riskScore,
    level: .riskProfile.riskLevel,
    category: .riskProfile.riskCategory,
    allowedInstruments: .riskProfile.allowedInstruments
  }
}'
echo ""

# Step 8: Get filtered instruments based on risk profile
echo "8. Getting suitable instruments for client..."
RISK_LEVEL=$(curl -s $BASE_URL/clients/$CLIENT_ID | jq -r '.riskProfile.riskLevel')
ALLOWED_INSTRUMENTS=$(curl -s $BASE_URL/clients/$CLIENT_ID | jq -r '.riskProfile.allowedInstruments')

curl -s -X POST $BASE_URL/instruments/filter \
  -H "Content-Type: application/json" \
  -d "{
    \"riskLevel\": $RISK_LEVEL,
    \"allowedInstruments\": $ALLOWED_INSTRUMENTS
  }" | jq '{
  riskLevel,
  totalInstruments,
  sampleInstruments: .instruments[0:5] | map({symbol, name, price, change})
}'
echo ""

# Step 9: Get historical data for sample instruments
echo "9. Getting historical data (1 year)..."
curl -s -X POST $BASE_URL/instruments/historical \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["AAPL", "MSFT"],
    "range": "1y"
  }' | jq '{
  historicalData: .historicalData | map({
    symbol,
    dataPoints: (.data | length),
    dateRange: (.data[0].date + " to " + .data[-1].date),
    return: ((.data[-1].value | tonumber) - 100 | tostring + "%")
  })
}'
echo ""

# Step 10: Get all clients
echo "10. Listing all clients..."
curl -s $BASE_URL/clients | jq 'map({
  id,
  name: (.personalInfo.firstName + " " + .personalInfo.lastName),
  riskLevel: .riskProfile.riskLevel,
  riskCategory: .riskProfile.riskCategory
})'
echo ""

echo "========================================="
echo "✅ API Test Complete!"
echo "========================================="
echo ""
echo "Client ID: $CLIENT_ID"
echo ""
echo "To delete this test client, run:"
echo "curl -X DELETE $BASE_URL/clients/$CLIENT_ID"
echo ""
