#!/bin/bash

# Verify Deployment Configuration Script
# Checks if all necessary files and configurations are in place for Render deployment

echo "🔍 Verifying Render Deployment Configuration..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_GOOD=true

# Check render.yaml exists
echo "📄 Checking deployment files..."
if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✓${NC} render.yaml found"
else
    echo -e "${RED}✗${NC} render.yaml not found"
    ALL_GOOD=false
fi

# Check backend package.json
if [ -f "backend/package.json" ]; then
    echo -e "${GREEN}✓${NC} backend/package.json found"
    
    # Check for engines field
    if grep -q '"engines"' backend/package.json; then
        echo -e "${GREEN}✓${NC} Node.js engines specified in backend"
    else
        echo -e "${YELLOW}⚠${NC} Node.js engines not specified in backend package.json"
    fi
else
    echo -e "${RED}✗${NC} backend/package.json not found"
    ALL_GOOD=false
fi

# Check frontend package.json
if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✓${NC} frontend/package.json found"
    
    # Check for engines field
    if grep -q '"engines"' frontend/package.json; then
        echo -e "${GREEN}✓${NC} Node.js engines specified in frontend"
    else
        echo -e "${YELLOW}⚠${NC} Node.js engines not specified in frontend package.json"
    fi
else
    echo -e "${RED}✗${NC} frontend/package.json not found"
    ALL_GOOD=false
fi

echo ""
echo "🔐 Checking environment configuration..."

# Check backend .env.example
if [ -f "backend/.env.example" ]; then
    echo -e "${GREEN}✓${NC} backend/.env.example found"
else
    echo -e "${YELLOW}⚠${NC} backend/.env.example not found"
fi

# Check frontend .env.example
if [ -f "frontend/.env.example" ]; then
    echo -e "${GREEN}✓${NC} frontend/.env.example found"
else
    echo -e "${YELLOW}⚠${NC} frontend/.env.example not found"
fi

# Check production env files
if [ -f "backend/.env.production" ]; then
    echo -e "${GREEN}✓${NC} backend/.env.production found"
else
    echo -e "${YELLOW}⚠${NC} backend/.env.production not found"
fi

if [ -f "frontend/.env.production" ]; then
    echo -e "${GREEN}✓${NC} frontend/.env.production found"
else
    echo -e "${YELLOW}⚠${NC} frontend/.env.production not found"
fi

echo ""
echo "📚 Checking documentation..."

if [ -f "RENDER_DEPLOYMENT.md" ]; then
    echo -e "${GREEN}✓${NC} RENDER_DEPLOYMENT.md found"
else
    echo -e "${YELLOW}⚠${NC} RENDER_DEPLOYMENT.md not found"
fi

if [ -f "DEPLOYMENT_CHECKLIST.md" ]; then
    echo -e "${GREEN}✓${NC} DEPLOYMENT_CHECKLIST.md found"
else
    echo -e "${YELLOW}⚠${NC} DEPLOYMENT_CHECKLIST.md not found"
fi

echo ""
echo "🔧 Checking backend configuration..."

# Check for health endpoint in server.js
if grep -q "/api/health" backend/server.js; then
    echo -e "${GREEN}✓${NC} Health check endpoint found"
else
    echo -e "${RED}✗${NC} Health check endpoint not found in server.js"
    ALL_GOOD=false
fi

# Check for CORS configuration
if grep -q "corsOptions" backend/server.js; then
    echo -e "${GREEN}✓${NC} CORS configuration found"
else
    echo -e "${YELLOW}⚠${NC} CORS configuration not found"
fi

echo ""
echo "⚙️  Checking frontend configuration..."

# Check if API_URL is configurable
if grep -q "REACT_APP_API_URL" frontend/src/App.js; then
    echo -e "${GREEN}✓${NC} API URL is configurable via environment variable"
else
    echo -e "${RED}✗${NC} API URL not configurable"
    ALL_GOOD=false
fi

echo ""
echo "📦 Checking dependencies..."

# Check if node_modules exist (should be gitignored)
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed locally"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed (run: cd backend && npm install)"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed locally"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed (run: cd frontend && npm install)"
fi

echo ""
echo "🔒 Checking .gitignore..."

if [ -f ".gitignore" ]; then
    if grep -q "\.env" .gitignore; then
        echo -e "${GREEN}✓${NC} .env files are gitignored"
    else
        echo -e "${RED}✗${NC} .env files not in .gitignore - SECURITY RISK!"
        ALL_GOOD=false
    fi
    
    if grep -q "node_modules" .gitignore; then
        echo -e "${GREEN}✓${NC} node_modules are gitignored"
    else
        echo -e "${YELLOW}⚠${NC} node_modules not in .gitignore"
    fi
else
    echo -e "${RED}✗${NC} .gitignore not found"
    ALL_GOOD=false
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✅ All critical checks passed!${NC}"
    echo ""
    echo "Your application is ready for Render deployment."
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Follow the guide in RENDER_DEPLOYMENT.md"
    echo "3. Use DEPLOYMENT_CHECKLIST.md as a reference"
else
    echo -e "${RED}❌ Some critical checks failed${NC}"
    echo ""
    echo "Please fix the issues marked with ✗ before deploying."
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
