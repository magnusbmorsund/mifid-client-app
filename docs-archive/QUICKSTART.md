# Quick Reference Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
# In backend folder
cd backend
npm install

# In frontend folder
cd ../frontend
npm install
```

### 2. Start the Application

**Option A - Automatic (Recommended):**
```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

**Option B - Manual:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### 3. Open in Browser
Navigate to: `http://localhost:3000`

---

## 📁 Project Structure

```
mifid-client-app/
├── backend/
│   ├── server.js           # Main backend server
│   ├── config.js           # Easy configuration
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main app component
│   │   ├── components/
│   │   │   ├── ClientForm.js       # Input form
│   │   │   ├── RiskProfile.js      # Risk display
│   │   │   ├── InstrumentSelector.js
│   │   │   └── PortfolioBuilder.js
│   │   └── styles/
│   │       └── App.css     # All styling
│   ├── public/
│   └── package.json
│
├── README.md               # Full documentation
├── CUSTOMIZATION.md        # How to add fields
└── start.sh / start.bat    # Startup scripts
```

---

## 🔧 Most Common Customizations

### Change Colors
Edit `frontend/src/styles/App.css` (lines 1-20):
```css
:root {
  --primary: #2563eb;      /* Your brand color */
  --success: #22c55e;
  --danger: #ef4444;
}
```

### Add Investment Instruments
Edit `backend/config.js`:
```javascript
instruments: {
  norwegian_stocks: [
    'EQNR.OL',
    'YOUR-STOCK.OL',  // Add here
  ]
}
```

### Adjust Risk Thresholds
Edit `backend/config.js`:
```javascript
riskThresholds: {
  veryHigh: 85,    // Change these numbers
  high: 70,
  moderate: 40,
}
```

### Add New Form Field
See `CUSTOMIZATION.md` for detailed examples

---

## 📊 Risk Assessment Logic

**Total Score: 0-100 points**

| Category | Points | Description |
|----------|--------|-------------|
| Financial Situation | 0-30 | Income, assets, net worth |
| Knowledge & Experience | 0-35 | Years investing, education |
| Investment Objectives | 0-20 | Time horizon, goals |
| Risk Tolerance | 0-15 | Self-assessed tolerance |

**Risk Levels:**
- 1 (Very Low): 0-14 points
- 2 (Low): 15-24 points
- 3 (Low-Moderate): 25-39 points
- 4 (Moderate): 40-54 points
- 5 (Moderate-High): 55-69 points
- 6 (High): 70-84 points
- 7 (Very High): 85-100 points

---

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/clients` | POST | Create/update client |
| `/api/clients` | GET | Get all clients |
| `/api/clients/:id` | GET | Get specific client |
| `/api/instruments/filter` | POST | Get filtered instruments |
| `/api/portfolios` | POST | Create portfolio |
| `/api/portfolios/:clientId` | GET | Get client portfolios |

---

## 🎨 Design System

### Colors
- **Primary Blue**: `#2563eb` - Main actions
- **Success Green**: `#22c55e` - Positive states
- **Warning Orange**: `#f97316` - Warnings
- **Danger Red**: `#ef4444` - Errors

### Typography
- **Headings**: Inter (700)
- **Body**: Inter (400)
- **Mono**: Space Mono (codes, numbers)

### Spacing
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 2rem (32px)

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change port in backend/.env
```

### Frontend won't start
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't fetch instruments
- Check internet connection
- Verify Yahoo Finance is accessible
- Check backend logs for errors

### CORS errors
- Ensure backend is running on port 5000
- Check `server.js` CORS configuration

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🔒 Security Notes

⚠️ **This is a development setup**

For production:
1. Use environment variables for sensitive data
2. Add authentication/authorization
3. Use HTTPS
4. Add rate limiting
5. Validate all inputs server-side
6. Use a real database (not in-memory)
7. Add logging and monitoring

---

## 📚 Additional Resources

- **Full Documentation**: See `README.md`
- **Customization Guide**: See `CUSTOMIZATION.md`
- **MiFID II Info**: [European Commission](https://ec.europa.eu/info/law/markets-financial-instruments-mifid-ii-directive-2014-65-eu_en)
- **Yahoo Finance**: Used for real-time instrument data

---

## 💡 Tips

1. **Test locally first** before deploying
2. **Backup data** before major changes
3. **Read error messages** - they're helpful!
4. **Check browser console** for frontend issues
5. **Check terminal** for backend issues
6. **Start simple** when adding features
7. **Comment your code** for future you

---

## 🆘 Need Help?

1. Check `CUSTOMIZATION.md` for examples
2. Review existing code patterns
3. Check terminal/console for errors
4. Verify all files are saved
5. Try restarting the servers

---

## ✅ Checklist for First Run

- [ ] Node.js 16+ installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Browser opened to localhost:3000
- [ ] Can see the form
- [ ] Can submit client data
- [ ] Risk profile calculates correctly
- [ ] Instruments load from Yahoo Finance
- [ ] Can create portfolio

---

**Happy profiling! 🎉**

For issues or questions, refer to the full documentation in `README.md`
