#!/bin/bash

# Prepare for Render Deployment Script
# This script helps prepare your application for deployment

echo "🚀 Preparing MiFID II Application for Render Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Verify configuration
echo -e "${BLUE}Step 1: Verifying deployment configuration...${NC}"
./verify-deployment-config.sh

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Configuration verification had warnings.${NC}"
    echo "You may want to fix these before deploying."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment preparation cancelled."
        exit 1
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 2: Check git status
echo -e "${BLUE}Step 2: Checking Git status...${NC}"

if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository found"
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠${NC} You have uncommitted changes:"
        echo ""
        git status --short
        echo ""
        read -p "Would you like to commit all changes now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            read -p "Enter commit message: " commit_msg
            git add .
            git commit -m "$commit_msg"
            echo -e "${GREEN}✓${NC} Changes committed"
        fi
    else
        echo -e "${GREEN}✓${NC} No uncommitted changes"
    fi
    
    # Check remote
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✓${NC} Git remote configured"
        echo ""
        echo "Remote URL:"
        git remote get-url origin
    else
        echo -e "${YELLOW}⚠${NC} No Git remote configured"
        echo ""
        echo "You'll need to add a remote before deploying:"
        echo "  git remote add origin <your-github-repo-url>"
    fi
else
    echo -e "${YELLOW}⚠${NC} Not a Git repository"
    echo ""
    read -p "Would you like to initialize Git? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        git add .
        read -p "Enter initial commit message: " commit_msg
        git commit -m "$commit_msg"
        echo -e "${GREEN}✓${NC} Git repository initialized"
        echo ""
        echo "Next, add your GitHub remote:"
        echo "  git remote add origin <your-github-repo-url>"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: API Keys reminder
echo -e "${BLUE}Step 3: API Keys Checklist${NC}"
echo ""
echo "Make sure you have obtained the following API keys:"
echo ""
echo "  ☐ Finnhub API Key"
echo "    Get it at: https://finnhub.io/"
echo ""
echo "  ☐ Twelve Data API Key"
echo "    Get it at: https://twelvedata.com/"
echo ""
echo "  ☐ EODHD API Key"
echo "    Get it at: https://eodhd.com/"
echo ""
echo "You'll need these when configuring environment variables in Render."
echo ""

read -p "Do you have all required API keys? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please obtain the API keys before deploying."
    echo "See the links above for registration."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 4: Summary
echo -e "${GREEN}✅ Preparation Complete!${NC}"
echo ""
echo "Your application is ready for deployment to Render."
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Push to GitHub (if you haven't already):"
echo "   ${YELLOW}git push origin main${NC}"
echo ""
echo "2. Deploy on Render:"
echo "   • Go to: https://dashboard.render.com/"
echo "   • Click: New + → Blueprint"
echo "   • Select your repository"
echo "   • Click: Apply"
echo ""
echo "3. Configure environment variables in Render dashboard"
echo "   (See RENDER_DEPLOYMENT.md for details)"
echo ""
echo "4. Generate frontend API key after backend deploys:"
echo "   ${YELLOW}node backend/generateApiKey.js \"Frontend Client\"${NC}"
echo ""
echo "📖 Detailed Guide: RENDER_DEPLOYMENT.md"
echo "✅ Checklist: DEPLOYMENT_CHECKLIST.md"
echo "📊 Summary: DEPLOYMENT_SUMMARY.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
