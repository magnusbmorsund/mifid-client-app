# Render Deployment Checklist

## Pre-Deployment

- [ ] All code committed to Git
- [ ] `.env` files are in `.gitignore`
- [ ] API keys obtained:
  - [ ] Finnhub API Key
  - [ ] Twelve Data API Key
  - [ ] EODHD API Key
- [ ] GitHub repository is public or connected to Render
- [ ] Render account created

## Backend Deployment

- [ ] Create web service in Render
- [ ] Set build command: `cd backend && npm install`
- [ ] Set start command: `cd backend && npm start`
- [ ] Configure environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `FINNHUB_API_KEY`
  - [ ] `TWELVE_DATA_API_KEY`
  - [ ] `EODHD_API_KEY`
- [ ] Deploy backend
- [ ] Verify health endpoint: `https://your-backend.onrender.com/api/health`
- [ ] Note backend URL for frontend configuration

## Frontend Deployment

- [ ] Generate API key for frontend:
  ```bash
  cd backend
  node generateApiKey.js "Frontend Client"
  ```
- [ ] Create static site in Render
- [ ] Set build command: `cd frontend && npm install && npm run build`
- [ ] Set publish directory: `frontend/build`
- [ ] Configure environment variables:
  - [ ] `REACT_APP_API_URL=https://your-backend.onrender.com/api`
  - [ ] `REACT_APP_API_KEY=<generated-key>`
- [ ] Add rewrite rule: `/*` → `/index.html`
- [ ] Deploy frontend

## Post-Deployment Testing

- [ ] Frontend loads successfully
- [ ] Backend health check responds
- [ ] Can create a new client profile
- [ ] Can search for instruments
- [ ] Can build a portfolio
- [ ] Can upload existing portfolio
- [ ] API authentication works
- [ ] No CORS errors in browser console

## Optional Enhancements

- [ ] Set up custom domain
- [ ] Configure monitoring/alerts
- [ ] Upgrade to paid plan (if needed)
- [ ] Set up staging environment
- [ ] Configure automatic deployments

## Troubleshooting

If something doesn't work:

1. Check Render logs for both services
2. Verify all environment variables are set
3. Test health endpoint
4. Check browser console for errors
5. Verify CORS configuration
6. Ensure API keys are valid

## Quick Deploy Command

If using Blueprint (render.yaml):

```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

Then go to Render Dashboard → New Blueprint → Select your repo

## URLs to Save

- Backend: `https://mifid-backend.onrender.com`
- Frontend: `https://mifid-frontend.onrender.com`
- Health Check: `https://mifid-backend.onrender.com/api/health`
- API Interface: `https://mifid-backend.onrender.com/`
