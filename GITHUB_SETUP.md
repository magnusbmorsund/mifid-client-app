# GitHub Setup Guide

This guide will help you upload the MiFID II Client Profiling System to GitHub.

---

## Pre-Upload Checklist

### ✅ Security Check (CRITICAL)

Before uploading, ensure these sensitive files are NOT included:

- [ ] `.env` files (backend and frontend)
- [ ] `api-keys.json` (API keys storage)
- [ ] `node_modules/` folders
- [ ] Any files with real API keys

**Verify with:**
```bash
# Check what will be committed
git status

# Check .gitignore is working
cat .gitignore
```

### ✅ Files to Include

- [x] Source code (backend, frontend)
- [x] Documentation (GUIDE.md, ARCHITECTURE.md, etc.)
- [x] `.env.example` files (templates without real keys)
- [x] `package.json` files
- [x] `.gitignore`
- [x] README.md

---

## Step-by-Step Upload

### Step 1: Initialize Git Repository

```bash
cd /Users/magnusberntzenmorsund/Desktop/mifid-client-app

# Initialize git
git init

# Add all files (respecting .gitignore)
git add .

# Check what's being added
git status

# Create initial commit
git commit -m "Initial commit: MiFID II Client Profiling System

- Complete client profiling system
- Risk assessment engine
- Portfolio management
- Portfolio comparison view
- API key authentication
- Multi-tenant support
- Market data integration (Finnhub, Twelve Data, EODHD)
- Comprehensive documentation"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/
2. Click the **"+"** icon (top right)
3. Select **"New repository"**

**Repository Settings:**
- **Name:** `mifid-client-profiling` (or your preferred name)
- **Description:** "MiFID II compliant investment advisory platform for client profiling, risk assessment, and portfolio management"
- **Visibility:** 
  - ✅ **Private** (recommended for business applications)
  - ⚠️ Public (only if you want to open-source)
- **Initialize:** 
  - ❌ Do NOT add README (we already have one)
  - ❌ Do NOT add .gitignore (we already have one)
  - ❌ Do NOT add license (add later if needed)

4. Click **"Create repository"**

### Step 3: Connect Local Repository to GitHub

GitHub will show you commands. Use these:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/mifid-client-profiling.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username.

---

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Login to GitHub
gh auth login

# Create repository and push
gh repo create mifid-client-profiling --private --source=. --remote=origin --push

# Or for public repository
gh repo create mifid-client-profiling --public --source=. --remote=origin --push
```

---

## Post-Upload Tasks

### 1. Verify Upload

Visit your repository on GitHub and check:
- [ ] All files are present
- [ ] `.env` files are NOT present
- [ ] `api-keys.json` is NOT present
- [ ] `node_modules/` is NOT present
- [ ] Documentation is readable
- [ ] README.md displays correctly

### 2. Add Repository Description

On GitHub repository page:
1. Click **"About"** (gear icon)
2. Add description: "MiFID II compliant investment advisory platform"
3. Add topics: `mifid-ii`, `fintech`, `risk-assessment`, `portfolio-management`, `react`, `nodejs`
4. Save

### 3. Set Up Branch Protection (Optional)

For team collaboration:
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - Require pull request reviews
   - Require status checks
   - Include administrators

### 4. Add Collaborators (Optional)

1. Go to **Settings** → **Collaborators**
2. Add team members
3. Set permissions (Read, Write, Admin)

---

## Environment Variables Setup for Team

### Create GitHub Secrets (for CI/CD)

If using GitHub Actions:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `FINNHUB_API_KEY`
   - `TWELVE_DATA_API_KEY`
   - `EODHD_API_KEY`

### Document for Team

Create `.env.example` files (already done):

**Backend:**
```
PORT=5001
FINNHUB_API_KEY=your_key_here
TWELVE_DATA_API_KEY=your_key_here
EODHD_API_KEY=your_key_here
FRONTEND_URL=http://localhost:3000
```

**Frontend:**
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_API_KEY=your_key_here
```

---

## Cloning for Team Members

Share these instructions with your team:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/mifid-client-profiling.git
cd mifid-client-profiling

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup environment variables
cd backend
cp .env.example .env
# Edit .env with real API keys

cd ../frontend
cp .env.example .env
# Edit .env with API URL and key

# Generate API key
cd ../backend
node generateApiKey.js "Your Name"

# Start application
cd backend && npm start
# In new terminal:
cd frontend && npm start
```

---

## Repository Structure on GitHub

```
mifid-client-profiling/
├── .github/                    # GitHub specific files (optional)
│   └── workflows/              # GitHub Actions (optional)
├── backend/
│   ├── authMiddleware.js
│   ├── generateApiKey.js
│   ├── manageApiKeys.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example           ✅ Included
│   └── public/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example           ✅ Included
├── docs-archive/              # Archived documentation
├── GUIDE.md                   # Main documentation
├── ARCHITECTURE.md            # Architecture docs
├── API_REFERENCE.md           # API documentation
├── API_SECURITY_SETUP.md      # Security guide
├── README.md                  # Project overview
├── .gitignore                 ✅ Included
└── setup-api-security.sh      # Setup script
```

**NOT Included (gitignored):**
- ❌ `.env` files (contain secrets)
- ❌ `api-keys.json` (contains API keys)
- ❌ `node_modules/` (dependencies)
- ❌ `portfolios/` (user data)
- ❌ Build files

---

## Adding a License (Optional)

### Recommended Licenses

**For Private/Commercial Use:**
- No license needed (all rights reserved)

**For Open Source:**
- **MIT License** - Permissive, allows commercial use
- **Apache 2.0** - Permissive with patent grant
- **GPL v3** - Copyleft, requires derivative works to be open source

### Add License

1. On GitHub, click **"Add file"** → **"Create new file"**
2. Name it `LICENSE`
3. Click **"Choose a license template"**
4. Select license
5. Commit

---

## Continuous Integration (Optional)

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install backend dependencies
      run: cd backend && npm install
    
    - name: Install frontend dependencies
      run: cd frontend && npm install
    
    - name: Run backend tests
      run: cd backend && npm test
    
    - name: Run frontend tests
      run: cd frontend && npm test
```

---

## Troubleshooting

### Issue: "fatal: not a git repository"
```bash
# Initialize git first
git init
```

### Issue: "remote origin already exists"
```bash
# Remove and re-add
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/repo.git
```

### Issue: "Permission denied (publickey)"
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/repo.git

# Or setup SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"
# Add to GitHub: Settings → SSH and GPG keys
```

### Issue: ".env file was committed"
```bash
# Remove from git but keep locally
git rm --cached backend/.env
git rm --cached frontend/.env
git commit -m "Remove .env files"
git push

# Make sure .gitignore includes .env
echo ".env" >> .gitignore
```

### Issue: "api-keys.json was committed"
```bash
# CRITICAL: Remove immediately
git rm --cached backend/api-keys.json
git commit -m "Remove API keys file"
git push

# Regenerate all API keys
cd backend
node manageApiKeys.js list
# Revoke all keys and generate new ones
```

---

## Security Best Practices

### Before Pushing

1. **Review all files:**
   ```bash
   git status
   git diff --cached
   ```

2. **Check for secrets:**
   ```bash
   grep -r "API_KEY" --exclude-dir=node_modules --exclude-dir=.git
   grep -r "password" --exclude-dir=node_modules --exclude-dir=.git
   ```

3. **Verify .gitignore:**
   ```bash
   cat .gitignore
   ```

### After Pushing

1. **Review repository on GitHub**
2. **Check no secrets are visible**
3. **Enable branch protection**
4. **Set repository to private** (if needed)

---

## Maintenance

### Regular Updates

```bash
# Pull latest changes
git pull origin main

# Make changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Description of changes"
git push origin main
```

### Creating Releases

1. Go to **Releases** → **Draft a new release**
2. Create tag: `v1.0.0`
3. Title: "Version 1.0.0 - Initial Release"
4. Description: List features and changes
5. Publish release

---

## Summary

✅ **Before Upload:**
- Check .gitignore
- Verify no secrets in code
- Create .env.example files

✅ **Upload Process:**
- Initialize git
- Create GitHub repository
- Push code

✅ **After Upload:**
- Verify files
- Add description
- Setup team access
- Document setup process

---

**Ready to upload?** Follow Step 1 above to get started!
