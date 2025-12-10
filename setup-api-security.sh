#!/bin/bash

# API Security Setup Script
# This script helps you set up API key authentication

echo "🔒 MiFID II API Security Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Step 1: Generate API Key
echo "Step 1: Generate API Key"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Enter your company/client name: " CLIENT_NAME

if [ -z "$CLIENT_NAME" ]; then
    echo "❌ Client name cannot be empty"
    exit 1
fi

cd backend
API_KEY_OUTPUT=$(node generateApiKey.js "$CLIENT_NAME")
echo "$API_KEY_OUTPUT"

# Extract API key from output
API_KEY=$(echo "$API_KEY_OUTPUT" | grep "API Key:" | awk '{print $3}')

if [ -z "$API_KEY" ]; then
    echo "❌ Failed to generate API key"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 2: Configure Frontend
echo "Step 2: Configure Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ../frontend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_API_KEY=$API_KEY
EOF
    echo "✅ Created frontend/.env with API key"
else
    echo "⚠️  frontend/.env already exists"
    read -p "Do you want to update it with the new API key? (y/n): " UPDATE_ENV
    if [ "$UPDATE_ENV" = "y" ] || [ "$UPDATE_ENV" = "Y" ]; then
        # Update or add API key
        if grep -q "REACT_APP_API_KEY" .env; then
            sed -i.bak "s/REACT_APP_API_KEY=.*/REACT_APP_API_KEY=$API_KEY/" .env
            rm .env.bak 2>/dev/null
        else
            echo "REACT_APP_API_KEY=$API_KEY" >> .env
        fi
        echo "✅ Updated frontend/.env with new API key"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: Instructions
echo "Step 3: Next Steps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ API Security Setup Complete!"
echo ""
echo "To start using the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2. Start the frontend (in a new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. The frontend will automatically use the API key"
echo ""
echo "📚 For more information, see API_SECURITY_SETUP.md"
echo ""
echo "🔑 To manage API keys:"
echo "   cd backend"
echo "   node manageApiKeys.js list      # List all keys"
echo "   node manageApiKeys.js stats     # View statistics"
echo "   node manageApiKeys.js revoke    # Revoke a key"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
