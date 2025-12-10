# Render Deployment Guide

This guide will help you deploy the MiFID II Client Profiling Application to Render.

## Overview

The application consists of two services:
- **Backend API** (Node.js/Express) - Web Service on port 10000
- **Frontend** (React) - Static Site

## Prerequisites

1. A [Render account](https://render.com) (free tier available)
2. Your GitHub repository connected to Render
3. API keys for external services:
   - Finnhub API Key ([Get it here](https://finnhub.io/))
   - Twelve Data API Key ([Get it here](https://twelvedata.com/))
   - EODHD API Key ([Get it here](https://eodhd.com/))

## Deployment Options

### Option 1: Blueprint Deployment (Recommended)

This uses the `render.yaml` file for infrastructure as code.

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Create New Blueprint in Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing this project
   - Render will automatically detect `render.yaml`
   - Click "Apply"

3. **Configure Environment Variables**
   
   After deployment, configure these variables in the Render dashboard:

   **For `mifid-backend` service:**
   - `FINNHUB_API_KEY` - Your Finnhub API key
   - `TWELVE_DATA_API_KEY` - Your Twelve Data API key
   - `EODHD_API_KEY` - Your EODHD API key
   - `NODE_ENV` - Already set to `production`
   - `PORT` - Already set to `10000`

   **For `mifid-frontend` service:**
   - `REACT_APP_API_URL` - Already set to `https://mifid-backend.onrender.com/api`
   - `REACT_APP_API_KEY` - Generate using backend's API key generator (see below)

4. **Generate Frontend API Key**
   
   Once the backend is deployed, generate an API key:
   ```bash
   # SSH into your backend service or run locally
   cd backend
   node generateApiKey.js "Frontend Client"
   ```
   
   Copy the generated API key and add it to the frontend's `REACT_APP_API_KEY` environment variable.

### Option 2: Manual Deployment

#### Deploy Backend

1. **Create Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Name:** `mifid-backend`
     - **Region:** Oregon (or your preferred region)
     - **Branch:** `main`
     - **Root Directory:** Leave empty
     - **Runtime:** Node
     - **Build Command:** `cd backend && npm install`
     - **Start Command:** `cd backend && npm start`
     - **Plan:** Free

2. **Add Environment Variables**
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `FINNHUB_API_KEY` = your_key
   - `TWELVE_DATA_API_KEY` = your_key
   - `EODHD_API_KEY` = your_key

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://mifid-backend.onrender.com`)

#### Deploy Frontend

1. **Create Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your repository
   - Configure:
     - **Name:** `mifid-frontend`
     - **Region:** Oregon (or your preferred region)
     - **Branch:** `main`
     - **Root Directory:** Leave empty
     - **Build Command:** `cd frontend && npm install && npm run build`
     - **Publish Directory:** `frontend/build`

2. **Add Environment Variables**
   - `REACT_APP_API_URL` = `https://mifid-backend.onrender.com/api` (use your actual backend URL)
   - `REACT_APP_API_KEY` = your_generated_api_key

3. **Add Rewrite Rule**
   - In the "Redirects/Rewrites" section, add:
     - **Source:** `/*`
     - **Destination:** `/index.html`
     - **Action:** Rewrite

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

## Post-Deployment Configuration

### 1. Update CORS Settings (if needed)

If you use custom domains, update the CORS configuration in `backend/server.js`:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-custom-domain.com',
        'https://mifid-frontend.onrender.com',
        /\.onrender\.com$/
      ]
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 2. Generate API Keys for Clients

SSH into your backend service or run locally:

```bash
cd backend
node generateApiKey.js "Client Name"
```

### 3. Test the Deployment

1. Visit your frontend URL (e.g., `https://mifid-frontend.onrender.com`)
2. Check the health endpoint: `https://mifid-backend.onrender.com/api/health`
3. Test the API interface: `https://mifid-backend.onrender.com/`

## Important Notes

### Free Tier Limitations

- **Spin Down:** Free tier services spin down after 15 minutes of inactivity
- **Spin Up Time:** First request after spin down takes 30-60 seconds
- **Monthly Hours:** 750 hours/month for web services
- **Bandwidth:** 100 GB/month

### Environment Variables

- Never commit `.env` files with real API keys
- Use Render's environment variable management
- Update `.env.example` files with documentation only

### Automatic Deployments

- Render automatically deploys on git push to the main branch
- Disable auto-deploy in settings if you want manual control

### Monitoring

- Check logs in Render Dashboard → Your Service → Logs
- Monitor health endpoint: `/api/health`
- Set up alerts in Render Dashboard

## Troubleshooting

### Backend Won't Start

1. Check environment variables are set correctly
2. Review logs in Render Dashboard
3. Verify build command completed successfully
4. Check that `PORT` is set to `10000`

### Frontend Can't Connect to Backend

1. Verify `REACT_APP_API_URL` points to correct backend URL
2. Check CORS settings in backend
3. Ensure `REACT_APP_API_KEY` is set correctly
4. Check browser console for errors

### API Keys Not Working

1. Regenerate API key using `generateApiKey.js`
2. Update environment variable in Render
3. Trigger a new deployment to pick up changes

### Build Failures

1. Check `package.json` for correct dependencies
2. Verify Node version compatibility
3. Review build logs for specific errors
4. Try building locally first: `npm install && npm run build`

## Updating the Application

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
4. Render will automatically deploy (if auto-deploy is enabled)

## Custom Domains

To use custom domains:

1. Go to your service in Render Dashboard
2. Click "Settings" → "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
5. Update CORS settings in backend if needed

## Scaling

To upgrade from free tier:

1. Go to service settings
2. Change plan to Starter ($7/month) or higher
3. Benefits:
   - No spin down
   - More resources
   - Better performance
   - Priority support

## Security Checklist

- ✅ Environment variables set in Render (not in code)
- ✅ API keys generated and secured
- ✅ CORS configured for production domains
- ✅ Rate limiting enabled (100 req/min per API key)
- ✅ HTTPS enabled by default on Render
- ✅ `.env` files in `.gitignore`

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- Check application logs in Render Dashboard

## Cost Estimate

**Free Tier (Recommended for Testing):**
- Backend: Free (with spin down)
- Frontend: Free
- Total: $0/month

**Production (No Spin Down):**
- Backend: Starter ($7/month)
- Frontend: Free
- Total: $7/month

**Professional:**
- Backend: Standard ($25/month)
- Frontend: Free
- Total: $25/month
