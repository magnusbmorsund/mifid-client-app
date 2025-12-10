#!/bin/bash

echo "🔍 MiFID II Client Profiling System - Installation Verification"
echo "=============================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

echo ""
echo "Checking project structure..."

# Check backend files
BACKEND_FILES=("backend/server.js" "backend/package.json" "backend/config.js" "backend/.env")
for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file missing"
    fi
done

# Check frontend files
FRONTEND_FILES=("frontend/package.json" "frontend/src/App.js" "frontend/src/index.js" "frontend/public/index.html")
for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file missing"
    fi
done

# Check component files
COMPONENT_FILES=("frontend/src/components/ClientForm.js" "frontend/src/components/RiskProfile.js" "frontend/src/components/InstrumentSelector.js" "frontend/src/components/PortfolioBuilder.js")
for file in "${COMPONENT_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file missing"
    fi
done

# Check CSS
if [ -f "frontend/src/styles/App.css" ]; then
    echo -e "${GREEN}✓${NC} frontend/src/styles/App.css"
else
    echo -e "${RED}✗${NC} frontend/src/styles/App.css missing"
fi

# Check documentation
echo ""
echo "Checking documentation..."
DOC_FILES=("README.md" "QUICKSTART.md" "CUSTOMIZATION.md" "ARCHITECTURE.md" "PROJECT-SUMMARY.md" "DOC-INDEX.md")
for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${YELLOW}⚠${NC} $file missing (optional)"
    fi
done

echo ""
echo "Checking if dependencies are installed..."

# Check backend node_modules
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed. Run: cd backend && npm install"
fi

# Check frontend node_modules
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed. Run: cd frontend && npm install"
fi

echo ""
echo "=============================================================="
echo "Verification complete!"
echo ""
echo "Next steps:"
echo "1. If dependencies not installed, run:"
echo "   cd backend && npm install"
echo "   cd ../frontend && npm install"
echo ""
echo "2. Start the application:"
echo "   ./start.sh (or start.bat on Windows)"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md or QUICKSTART.md"
echo "=============================================================="
