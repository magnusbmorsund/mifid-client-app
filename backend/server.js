const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import authentication middleware
const { authenticateApiKey, optionalAuth, rateLimitByKey } = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

// Hybrid API configuration
// Finnhub for real-time quotes (60 calls/min)
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Twelve Data for historical data (800 calls/day)
const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY || 'demo';
const TWELVE_DATA_BASE_URL = 'https://api.twelvedata.com';

// EODHD for instrument universe with ISINs
const EODHD_API_KEY = process.env.EODHD_API_KEY || 'demo';
const EODHD_BASE_URL = 'https://eodhd.com/api';

// Create portfolios folder if it doesn't exist
const PORTFOLIOS_DIR = path.join(__dirname, '..', 'portfolios');
if (!fs.existsSync(PORTFOLIOS_DIR)) {
  fs.mkdirSync(PORTFOLIOS_DIR, { recursive: true });
}

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://mifid-frontend.onrender.com',
        /\.onrender\.com$/  // Allow all Render preview deployments
      ]
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting per API key
app.use('/api/', rateLimitByKey(100, 60000)); // 100 requests per minute per key

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve API interface at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'api-interface.html'));
});

// In-memory storage (replace with database in production)
let clients = [];
let portfolios = [];
let accounts = []; // Account structure linking clients to portfolios

// Multi-Tenant Risk Configuration Storage
let riskConfigurations = {
  'retail': {
    name: 'Retail Banking',
    description: 'Standard retail banking clients',
    scoringRules: {
      financialSituation: {
        annualIncome: [
          { min: 0, max: 300000, points: 5, label: 'Low Income' },
          { min: 300000, max: 750000, points: 10, label: 'Medium Income' },
          { min: 750000, max: 1500000, points: 15, label: 'High Income' },
          { min: 1500000, max: null, points: 20, label: 'Very High Income' }
        ],
        netWorth: [
          { min: 0, max: 500000, points: 5, label: 'Low Net Worth' },
          { min: 500000, max: 2000000, points: 10, label: 'Medium Net Worth' },
          { min: 2000000, max: 5000000, points: 15, label: 'High Net Worth' },
          { min: 5000000, max: null, points: 20, label: 'Very High Net Worth' }
        ],
        investableAssets: [
          { min: 0, max: 250000, points: 5, label: 'Low Assets' },
          { min: 250000, max: 1000000, points: 10, label: 'Medium Assets' },
          { min: 1000000, max: 2500000, points: 15, label: 'High Assets' },
          { min: 2500000, max: null, points: 20, label: 'Very High Assets' }
        ]
      },
      knowledgeExperience: {
        yearsInvesting: [
          { min: 10, max: null, points: 20, label: 'Over 10 years' },
          { min: 5, max: 10, points: 15, label: '5-10 years' },
          { min: 2, max: 5, points: 8, label: '2-5 years' },
          { min: 0, max: 2, points: 3, label: 'Under 2 years' }
        ],
        educationLevel: {
          'finance_degree': { points: 15, label: 'Finance Degree' },
          'professional': { points: 15, label: 'Professional' },
          'university': { points: 8, label: 'University' },
          'high_school': { points: 3, label: 'High School' },
          'other': { points: 3, label: 'Other' }
        },
        instrumentKnowledgeMultiplier: 2,
        maxInstrumentPoints: 15
      },
      objectives: {
        timeHorizon: {
          'long': { points: 15, label: 'Long-term (10+ years)' },
          'medium': { points: 10, label: 'Medium-term (5-10 years)' },
          'short': { points: 3, label: 'Short-term (< 5 years)' }
        },
        primaryObjective: {
          'aggressive_growth': { points: 15, label: 'Aggressive Growth' },
          'growth': { points: 10, label: 'Growth' },
          'balanced': { points: 5, label: 'Balanced' },
          'income': { points: 2, label: 'Income' },
          'capital_preservation': { points: 2, label: 'Capital Preservation' }
        }
      },
      riskTolerance: {
        level: {
          'aggressive': { points: 20, label: 'Aggressive' },
          'moderate': { points: 12, label: 'Moderate' },
          'conservative': { points: 5, label: 'Conservative' },
          'very_conservative': { points: 2, label: 'Very Conservative' }
        }
      }
    },
    riskLevels: [
      {
        level: 1,
        minScore: 0,
        maxScore: 15,
        category: 'Very Low Risk',
        allowedInstruments: ['government_bonds', 'money_market', 'savings']
      },
      {
        level: 2,
        minScore: 16,
        maxScore: 25,
        category: 'Low Risk',
        allowedInstruments: ['bonds', 'bond_funds', 'money_market', 'government_bonds']
      },
      {
        level: 3,
        minScore: 26,
        maxScore: 40,
        category: 'Low-Moderate Risk',
        allowedInstruments: ['etfs', 'bonds', 'mutual_funds', 'dividend_stocks']
      },
      {
        level: 4,
        minScore: 41,
        maxScore: 55,
        category: 'Moderate Risk',
        allowedInstruments: ['stocks', 'etfs', 'bonds', 'mutual_funds', 'balanced_funds']
      },
      {
        level: 5,
        minScore: 56,
        maxScore: 70,
        category: 'Moderate-High Risk',
        allowedInstruments: ['stocks', 'etfs', 'bonds', 'mutual_funds', 'reits']
      },
      {
        level: 6,
        minScore: 71,
        maxScore: 85,
        category: 'High Risk',
        allowedInstruments: ['stocks', 'etfs', 'commodities', 'high_yield_bonds', 'reits']
      },
      {
        level: 7,
        minScore: 86,
        maxScore: 999,
        category: 'Very High Risk',
        allowedInstruments: ['stocks', 'etfs', 'commodities', 'reits', 'high_yield_bonds']
      }
    ]
  },
  'private_banking': {
    name: 'Private Banking',
    description: 'High net worth private banking clients',
    scoringRules: {
      financialSituation: {
        annualIncome: [
          { min: 0, max: 500000, points: 5, label: 'Low Income' },
          { min: 500000, max: 1500000, points: 10, label: 'Medium Income' },
          { min: 1500000, max: 3000000, points: 15, label: 'High Income' },
          { min: 3000000, max: null, points: 20, label: 'Very High Income' }
        ],
        netWorth: [
          { min: 0, max: 2000000, points: 5, label: 'Low Net Worth' },
          { min: 2000000, max: 5000000, points: 10, label: 'Medium Net Worth' },
          { min: 5000000, max: 10000000, points: 15, label: 'High Net Worth' },
          { min: 10000000, max: null, points: 20, label: 'Ultra High Net Worth' }
        ],
        investableAssets: [
          { min: 0, max: 1000000, points: 5, label: 'Low Assets' },
          { min: 1000000, max: 2500000, points: 10, label: 'Medium Assets' },
          { min: 2500000, max: 5000000, points: 15, label: 'High Assets' },
          { min: 5000000, max: null, points: 20, label: 'Very High Assets' }
        ]
      },
      knowledgeExperience: {
        yearsInvesting: [
          { min: 10, max: null, points: 20, label: 'Over 10 years' },
          { min: 5, max: 10, points: 15, label: '5-10 years' },
          { min: 2, max: 5, points: 8, label: '2-5 years' },
          { min: 0, max: 2, points: 3, label: 'Under 2 years' }
        ],
        educationLevel: {
          'finance_degree': { points: 15, label: 'Finance Degree' },
          'professional': { points: 15, label: 'Professional' },
          'university': { points: 8, label: 'University' },
          'high_school': { points: 3, label: 'High School' },
          'other': { points: 3, label: 'Other' }
        },
        instrumentKnowledgeMultiplier: 2,
        maxInstrumentPoints: 15
      },
      objectives: {
        timeHorizon: {
          'long': { points: 15, label: 'Long-term (10+ years)' },
          'medium': { points: 10, label: 'Medium-term (5-10 years)' },
          'short': { points: 3, label: 'Short-term (< 5 years)' }
        },
        primaryObjective: {
          'aggressive_growth': { points: 15, label: 'Aggressive Growth' },
          'growth': { points: 10, label: 'Growth' },
          'balanced': { points: 5, label: 'Balanced' },
          'income': { points: 2, label: 'Income' },
          'capital_preservation': { points: 2, label: 'Capital Preservation' }
        }
      },
      riskTolerance: {
        level: {
          'aggressive': { points: 20, label: 'Aggressive' },
          'moderate': { points: 12, label: 'Moderate' },
          'conservative': { points: 5, label: 'Conservative' },
          'very_conservative': { points: 2, label: 'Very Conservative' }
        }
      }
    },
    riskLevels: [
      {
        level: 1,
        minScore: 0,
        maxScore: 15,
        category: 'Very Low Risk',
        allowedInstruments: ['government_bonds', 'money_market', 'bonds', 'bond_funds']
      },
      {
        level: 2,
        minScore: 16,
        maxScore: 25,
        category: 'Low Risk',
        allowedInstruments: ['bonds', 'bond_funds', 'money_market', 'government_bonds', 'dividend_stocks']
      },
      {
        level: 3,
        minScore: 26,
        maxScore: 40,
        category: 'Low-Moderate Risk',
        allowedInstruments: ['etfs', 'bonds', 'mutual_funds', 'dividend_stocks', 'stocks', 'reits']
      },
      {
        level: 4,
        minScore: 41,
        maxScore: 55,
        category: 'Moderate Risk',
        allowedInstruments: ['stocks', 'etfs', 'bonds', 'mutual_funds', 'balanced_funds', 'reits', 'commodities']
      },
      {
        level: 5,
        minScore: 56,
        maxScore: 70,
        category: 'Moderate-High Risk',
        allowedInstruments: ['stocks', 'etfs', 'bonds', 'mutual_funds', 'reits', 'commodities', 'options', 'high_yield_bonds']
      },
      {
        level: 6,
        minScore: 71,
        maxScore: 85,
        category: 'High Risk',
        allowedInstruments: ['stocks', 'options', 'etfs', 'commodities', 'high_yield_bonds', 'reits', 'futures', 'crypto']
      },
      {
        level: 7,
        minScore: 86,
        maxScore: 999,
        category: 'Very High Risk',
        allowedInstruments: ['stocks', 'options', 'futures', 'leveraged_etfs', 'commodities', 'crypto', 'bonds', 'etfs', 'reits', 'high_yield_bonds']
      }
    ]
  }
};

// Helper function to find matching range
function findMatchingRange(value, ranges) {
  for (const range of ranges) {
    if (value >= range.min && (range.max === null || value < range.max)) {
      return range;
    }
  }
  return ranges[ranges.length - 1]; // Return last range as fallback
}

// MiFID II Risk Assessment Algorithm (Multi-Tenant, No Financial Situation)
function calculateRiskProfile(clientData, tenantId = 'retail') {
  let riskScore = 0;
  const factors = [];
  
  // Get tenant-specific configuration
  const tenantConfig = riskConfigurations[tenantId];
  if (!tenantConfig) {
    throw new Error(`Invalid tenant: ${tenantId}`);
  }
  
  const config = tenantConfig.scoringRules;

  // Knowledge & Experience Assessment
  const yearsExperience = Number(clientData.knowledgeExperience?.yearsInvesting) || 0;
  const educationLevel = clientData.knowledgeExperience?.educationLevel;
  const instrumentKnowledge = clientData.knowledgeExperience?.instrumentKnowledge || [];
  
  // Years of experience scoring
  if (config.knowledgeExperience?.yearsInvesting) {
    const range = findMatchingRange(yearsExperience, config.knowledgeExperience.yearsInvesting);
    riskScore += range.points;
    if (range.points >= 15) factors.push('Extensive investment experience');
  }

  // Education level scoring
  if (config.knowledgeExperience?.educationLevel && educationLevel) {
    const eduConfig = config.knowledgeExperience.educationLevel[educationLevel];
    if (eduConfig) {
      riskScore += eduConfig.points;
      if (eduConfig.points >= 10) factors.push('Professional financial education');
    }
  }

  // Instrument knowledge scoring
  const knownInstruments = instrumentKnowledge.filter(i => i.knowledge === 'experienced' || i.knowledge === 'expert').length;
  const multiplier = config.knowledgeExperience?.instrumentKnowledgeMultiplier || 2;
  const maxPoints = config.knowledgeExperience?.maxInstrumentPoints || 10;
  riskScore += Math.min(knownInstruments * multiplier, maxPoints);

  // Investment Objectives & Time Horizon
  const timeHorizon = clientData.objectives?.timeHorizon || 'medium';
  const objective = clientData.objectives?.primaryObjective || 'growth';

  // Time horizon scoring
  if (config.objectives?.timeHorizon && timeHorizon) {
    const horizonConfig = config.objectives.timeHorizon[timeHorizon];
    if (horizonConfig) {
      riskScore += horizonConfig.points;
      if (horizonConfig.points >= 10) factors.push('Long-term investment horizon');
    }
  }

  // Primary objective scoring
  if (config.objectives?.primaryObjective && objective) {
    const objConfig = config.objectives.primaryObjective[objective];
    if (objConfig) {
      riskScore += objConfig.points;
    }
  }

  // Risk Tolerance
  const riskTolerance = clientData.riskTolerance?.level || 'moderate';
  
  if (config.riskTolerance?.level && riskTolerance) {
    const tolConfig = config.riskTolerance.level[riskTolerance];
    if (tolConfig) {
      riskScore += tolConfig.points;
      if (tolConfig.points >= 15) factors.push('Aggressive risk tolerance');
    }
  }

  // Determine risk level from tenant configuration
  let riskLevel = 1;
  let riskCategory = 'Very Low Risk';
  let allowedInstruments = [];

  for (const level of tenantConfig.riskLevels) {
    if (riskScore >= level.minScore && riskScore <= level.maxScore) {
      riskLevel = level.level;
      riskCategory = level.category;
      allowedInstruments = level.allowedInstruments;
      break;
    }
  }

  return {
    riskScore,
    riskLevel,
    riskCategory,
    allowedInstruments,
    factors,
    tenant: tenantId,
    tenantName: tenantConfig.name,
    sustainability: clientData.sustainability
  };
}

// Fetch investment instruments from Finnhub
async function fetchInstruments(symbols) {
  try {
    const results = [];
    
    // Finnhub requires individual requests per symbol
    // Free tier: 60 calls/minute, so we can handle this easily
    for (const symbol of symbols) {
      try {
        const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
          params: {
            symbol: symbol,
            token: FINNHUB_API_KEY
          },
          timeout: 10000
        });

        const quote = response.data;
        
        if (!quote || quote.c === undefined) {
          console.error(`No data returned for ${symbol}`);
          continue;
        }

        const currentPrice = parseFloat(quote.c); // Current price
        const previousClose = parseFloat(quote.pc); // Previous close
        const change = ((currentPrice - previousClose) / previousClose * 100);
        const changeValue = currentPrice - previousClose;

        results.push({
          symbol: symbol,
          name: symbol, // Finnhub quote doesn't include name, we'll get it separately if needed
          price: currentPrice,
          currency: 'USD',
          change: change.toFixed(2),
          changeValue: changeValue.toFixed(2),
          high: parseFloat(quote.h),
          low: parseFloat(quote.l),
          open: parseFloat(quote.o),
          previousClose: previousClose,
          exchange: 'US',
          type: categorizeInstrument(symbol)
        });
        
        // Small delay to respect rate limits (60/min = 1 per second)
        // Reduced to 100ms for better performance - still respects rate limits with batching
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching instruments:', error);
    throw error;
  }
}

function categorizeInstrument(symbol) {
  if (symbol.includes('BTC') || symbol.includes('ETH')) return 'crypto';
  if (symbol.endsWith('.OL')) return 'stocks'; // Oslo Børs
  if (symbol.includes('TLT') || symbol.includes('AGG') || symbol.includes('BND')) return 'bonds';
  if (symbol.includes('SPY') || symbol.includes('VOO') || symbol.includes('VTI')) return 'etfs';
  if (symbol.includes('GLD') || symbol.includes('SLV')) return 'commodities';
  return 'stocks'; // Default
}

// API Endpoints

// Create or update client profile (Protected)
app.post('/api/clients', authenticateApiKey, (req, res) => {
  try {
    const clientData = req.body;
    
    // Validate required fields
    if (!clientData.financialSituation || !clientData.knowledgeExperience) {
      return res.status(400).json({ error: 'Missing required client data' });
    }
    
    const riskProfile = calculateRiskProfile(clientData, clientData.tenant || 'retail');
    
    const client = {
      id: clientData.id || Date.now().toString(),
      ...clientData,
      riskProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = clients.findIndex(c => c.id === client.id);
    if (existingIndex >= 0) {
      clients[existingIndex] = client;
    } else {
      clients.push(client);
    }

    res.json(client);
  } catch (error) {
    console.error('Error processing client data:', error);
    res.status(500).json({ error: error.message, details: 'Failed to calculate risk profile' });
  }
});

// Get all clients
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

// Get specific client
app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
});

// Delete a client
app.delete('/api/clients/:id', (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index >= 0) {
    const deleted = clients.splice(index, 1);
    res.json({ message: 'Client deleted successfully', client: deleted[0] });
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
});

// ============================================
// GRANULAR CLIENT PROFILE INPUT ENDPOINTS
// ============================================

// Update Personal Information (Protected)
app.post('/api/clients/:id/personal-info', authenticateApiKey, (req, res) => {
  try {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { firstName, lastName, email, phone, dateOfBirth, nationality, address } = req.body;
    
    client.personalInfo = {
      firstName: firstName || client.personalInfo?.firstName,
      lastName: lastName || client.personalInfo?.lastName,
      email: email || client.personalInfo?.email,
      phone: phone || client.personalInfo?.phone,
      dateOfBirth: dateOfBirth || client.personalInfo?.dateOfBirth,
      nationality: nationality || client.personalInfo?.nationality,
      address: address || client.personalInfo?.address
    };
    
    client.updatedAt = new Date().toISOString();
    
    res.json({ 
      message: 'Personal information updated successfully', 
      personalInfo: client.personalInfo,
      clientId: client.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Financial Situation (Protected)
app.post('/api/clients/:id/financial-situation', authenticateApiKey, (req, res) => {
  try {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { annualIncome, netWorth, investableAssets, employmentStatus, sourceOfWealth } = req.body;
    
    client.financialSituation = {
      annualIncome: annualIncome !== undefined ? annualIncome : client.financialSituation?.annualIncome,
      netWorth: netWorth !== undefined ? netWorth : client.financialSituation?.netWorth,
      investableAssets: investableAssets !== undefined ? investableAssets : client.financialSituation?.investableAssets,
      employmentStatus: employmentStatus || client.financialSituation?.employmentStatus,
      sourceOfWealth: sourceOfWealth || client.financialSituation?.sourceOfWealth
    };
    
    client.updatedAt = new Date().toISOString();
    
    // Recalculate risk profile if knowledge data exists
    if (client.knowledgeExperience) {
      client.riskProfile = calculateRiskProfile(client, client.tenant || 'retail');
    }
    
    res.json({ 
      message: 'Financial situation updated successfully', 
      financialSituation: client.financialSituation,
      riskProfile: client.riskProfile,
      clientId: client.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Knowledge & Experience (Protected)
app.post('/api/clients/:id/knowledge-experience', authenticateApiKey, (req, res) => {
  try {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { yearsInvesting, educationLevel, instrumentKnowledge, tradingFrequency, professionalExperience } = req.body;
    
    client.knowledgeExperience = {
      yearsInvesting: yearsInvesting !== undefined ? yearsInvesting : client.knowledgeExperience?.yearsInvesting,
      educationLevel: educationLevel || client.knowledgeExperience?.educationLevel,
      instrumentKnowledge: instrumentKnowledge || client.knowledgeExperience?.instrumentKnowledge || [],
      tradingFrequency: tradingFrequency || client.knowledgeExperience?.tradingFrequency,
      professionalExperience: professionalExperience !== undefined ? professionalExperience : client.knowledgeExperience?.professionalExperience
    };
    
    client.updatedAt = new Date().toISOString();
    
    // Recalculate risk profile
    if (client.knowledgeExperience) {
      client.riskProfile = calculateRiskProfile(client, client.tenant || 'retail');
    }
    
    res.json({ 
      message: 'Knowledge & experience updated successfully', 
      knowledgeExperience: client.knowledgeExperience,
      riskProfile: client.riskProfile,
      clientId: client.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Investment Objectives (Protected)
app.post('/api/clients/:id/objectives', authenticateApiKey, (req, res) => {
  try {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { primaryObjective, timeHorizon, liquidityNeeds, expectedReturn, investmentAmount } = req.body;
    
    client.objectives = {
      primaryObjective: primaryObjective || client.objectives?.primaryObjective,
      timeHorizon: timeHorizon || client.objectives?.timeHorizon,
      liquidityNeeds: liquidityNeeds || client.objectives?.liquidityNeeds,
      expectedReturn: expectedReturn !== undefined ? expectedReturn : client.objectives?.expectedReturn,
      investmentAmount: investmentAmount !== undefined ? investmentAmount : client.objectives?.investmentAmount
    };
    
    client.updatedAt = new Date().toISOString();
    
    // Recalculate risk profile
    if (client.knowledgeExperience) {
      client.riskProfile = calculateRiskProfile(client, client.tenant || 'retail');
    }
    
    res.json({ 
      message: 'Investment objectives updated successfully', 
      objectives: client.objectives,
      riskProfile: client.riskProfile,
      clientId: client.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Risk Tolerance (Protected)
app.post('/api/clients/:id/risk-tolerance', authenticateApiKey, (req, res) => {
  try {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { level, maxDrawdown, volatilityComfort, lossReaction } = req.body;
    
    client.riskTolerance = {
      level: level || client.riskTolerance?.level,
      maxDrawdown: maxDrawdown !== undefined ? maxDrawdown : client.riskTolerance?.maxDrawdown,
      volatilityComfort: volatilityComfort || client.riskTolerance?.volatilityComfort,
      lossReaction: lossReaction || client.riskTolerance?.lossReaction
    };
    
    client.updatedAt = new Date().toISOString();
    
    // Recalculate risk profile
    if (client.knowledgeExperience) {
      client.riskProfile = calculateRiskProfile(client, client.tenant || 'retail');
    }
    
    res.json({ 
      message: 'Risk tolerance updated successfully', 
      riskTolerance: client.riskTolerance,
      riskProfile: client.riskProfile,
      clientId: client.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Sustainability Preferences (Protected)
app.post('/api/clients/:id/sustainability', authenticateApiKey, (req, res) => {
  try {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { esgImportance, excludeSectors, preferredSectors, esgMinRating } = req.body;
    
    client.sustainability = {
      esgImportance: esgImportance || client.sustainability?.esgImportance,
      excludeSectors: excludeSectors || client.sustainability?.excludeSectors || [],
      preferredSectors: preferredSectors || client.sustainability?.preferredSectors || [],
      esgMinRating: esgMinRating !== undefined ? esgMinRating : client.sustainability?.esgMinRating
    };
    
    client.updatedAt = new Date().toISOString();
    
    // Recalculate risk profile
    if (client.knowledgeExperience) {
      client.riskProfile = calculateRiskProfile(client, client.tenant || 'retail');
    }
    
    res.json({ 
      message: 'Sustainability preferences updated successfully', 
      sustainability: client.sustainability,
      riskProfile: client.riskProfile,
      clientId: client.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new client (minimal data required) (Protected)
app.post('/api/clients/new', authenticateApiKey, (req, res) => {
  try {
    const { firstName, lastName, email, tenant } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'firstName, lastName, and email are required' });
    }
    
    // Validate tenant
    const tenantId = tenant || 'retail';
    if (!riskConfigurations[tenantId]) {
      return res.status(400).json({ error: `Invalid tenant: ${tenantId}. Available: ${Object.keys(riskConfigurations).join(', ')}` });
    }
    
    const newClient = {
      id: Date.now().toString(),
      tenant: tenantId,
      personalInfo: {
        firstName,
        lastName,
        email,
        phone: req.body.phone || '',
        dateOfBirth: req.body.dateOfBirth || '',
        nationality: req.body.nationality || '',
        address: req.body.address || ''
      },
      financialSituation: {},
      knowledgeExperience: {},
      objectives: {},
      riskTolerance: {},
      sustainability: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    clients.push(newClient);
    
    res.status(201).json({ 
      message: 'Client created successfully', 
      client: newClient,
      tenantConfig: riskConfigurations[tenantId].name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get instruments based on risk profile
app.post('/api/instruments/filter', async (req, res) => {
  try {
    const { riskLevel, allowedInstruments, sustainabilityPreferences } = req.body;

    // Default instrument universe - Finnhub compatible
    // Finnhub supports US stocks, ETFs, and crypto
    const instrumentUniverse = {
      stocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'IBM', 'JPM', 'BAC', 'WMT', 'DIS', 'NFLX', 'INTC', 'AMD'],
      bonds: ['TLT', 'IEF', 'SHY', 'AGG', 'BND'], // Treasury and Bond ETFs
      etfs: ['SPY', 'QQQ', 'DIA', 'IWM', 'VOO', 'VTI'], // Major ETFs
      commodities: ['GLD', 'SLV', 'USO', 'DBC'], // Commodity ETFs
      crypto: ['BTCUSD', 'ETHUSD', 'BNBUSD'], // Crypto (Finnhub format)
      mutual_funds: ['IBM', 'GE', 'F', 'T', 'C'], // Blue-chip stocks
      balanced_funds: ['KO', 'PEP', 'JNJ', 'PG', 'MCD'], // Consumer staples
      dividend_stocks: ['VZ', 'T', 'XOM', 'CVX', 'PFE', 'KO', 'PEP'], // High dividend stocks
      reits: ['O', 'SPG', 'VNO', 'PSA', 'AMT'], // REIT stocks
      high_yield_bonds: ['HYG', 'JNK'], // High yield bond ETFs
      bond_funds: ['BND', 'AGG', 'LQD'], // Bond fund ETFs
      government_bonds: ['TLT', 'IEF', 'SHY'], // Treasury bonds
      money_market: ['MSFT', 'AAPL', 'JNJ'], // Stable blue chips
      savings: ['JNJ', 'PG', 'KO'] // Ultra-stable stocks
    };

    // Filter instruments based on allowed categories
    let selectedSymbols = [];
    allowedInstruments.forEach(category => {
      if (instrumentUniverse[category]) {
        selectedSymbols = selectedSymbols.concat(instrumentUniverse[category]);
      }
    });

    // Remove duplicates and limit to first 20 symbols for faster initial load
    selectedSymbols = [...new Set(selectedSymbols)].slice(0, 20);

    // Fetch data for selected instruments
    const instruments = await fetchInstruments(selectedSymbols);

    // Apply sustainability filters if needed
    let filteredInstruments = instruments;
    if (sustainabilityPreferences && sustainabilityPreferences.excludeSectors) {
      // In production, you would have ESG data to filter by
      // For now, we'll just return all instruments
      filteredInstruments = instruments;
    }

    res.json({
      riskLevel,
      totalInstruments: filteredInstruments.length,
      instruments: filteredInstruments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create portfolio (Protected)
app.post('/api/portfolios', authenticateApiKey, (req, res) => {
  try {
    const portfolio = {
      id: Date.now().toString(),
      clientId: req.body.clientId,
      clientName: req.body.clientName,
      name: req.body.name,
      type: 'proposed', // Mark as proposed portfolio
      holdings: req.body.holdings,
      totalValue: req.body.totalValue,
      amountForAdvice: req.body.amountForAdvice,
      createdAt: new Date().toISOString()
    };

    // Save portfolio to JSON file
    const fileName = `portfolio_${portfolio.id}.json`;
    const filePath = path.join(PORTFOLIOS_DIR, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(portfolio, null, 2), 'utf8');
    console.log(`Portfolio saved to: ${filePath}`);

    portfolios.push(portfolio);
    
    // Update or create account
    let account = accounts.find(a => a.clientId === portfolio.clientId);
    if (!account) {
      account = {
        id: Date.now().toString(),
        clientId: portfolio.clientId,
        existingPortfolios: [],
        proposedPortfolios: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      accounts.push(account);
    }
    
    account.proposedPortfolios.push(portfolio.id);
    account.updatedAt = new Date().toISOString();
    
    res.json({ 
      ...portfolio, 
      savedToFile: fileName 
    });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get portfolios for a client
app.get('/api/portfolios/:clientId', (req, res) => {
  const clientPortfolios = portfolios.filter(p => p.clientId === req.params.clientId);
  res.json(clientPortfolios);
});

// ============================================
// ACCOUNT & EXISTING PORTFOLIO ENDPOINTS
// ============================================

// Create or get account for a client (Protected)
app.post('/api/accounts', authenticateApiKey, (req, res) => {
  try {
    const { clientId } = req.body;
    
    if (!clientId) {
      return res.status(400).json({ error: 'clientId is required' });
    }
    
    // Check if account already exists
    let account = accounts.find(a => a.clientId === clientId);
    
    if (!account) {
      account = {
        id: Date.now().toString(),
        clientId: clientId,
        existingPortfolios: [],
        proposedPortfolios: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      accounts.push(account);
    }
    
    res.json(account);
  } catch (error) {
    console.error('Error creating/getting account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get account for a client
app.get('/api/accounts/:clientId', (req, res) => {
  try {
    const account = accounts.find(a => a.clientId === req.params.clientId);
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    // Populate with full portfolio data
    const existingPortfolios = account.existingPortfolios.map(id => 
      portfolios.find(p => p.id === id)
    ).filter(p => p);
    
    const proposedPortfolios = account.proposedPortfolios.map(id => 
      portfolios.find(p => p.id === id)
    ).filter(p => p);
    
    res.json({
      ...account,
      existingPortfolios,
      proposedPortfolios
    });
  } catch (error) {
    console.error('Error getting account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload existing portfolio holdings (Protected)
app.post('/api/accounts/:clientId/existing-portfolio', authenticateApiKey, (req, res) => {
  try {
    const { clientId } = req.params;
    const { name, holdings } = req.body;
    
    if (!name || !holdings || !Array.isArray(holdings)) {
      return res.status(400).json({ error: 'name and holdings array are required' });
    }
    
    // Validate holdings structure
    for (const holding of holdings) {
      if (!holding.symbol || !holding.quantity || holding.currentValue === undefined) {
        return res.status(400).json({ 
          error: 'Each holding must have symbol, quantity, and currentValue' 
        });
      }
    }
    
    // Calculate total value
    const totalValue = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
    
    // Create portfolio
    const portfolio = {
      id: Date.now().toString(),
      clientId: clientId,
      name: name,
      type: 'existing',
      holdings: holdings.map(h => ({
        symbol: h.symbol,
        name: h.name || h.symbol,
        quantity: h.quantity,
        currentValue: h.currentValue,
        purchasePrice: h.purchasePrice || null,
        purchaseDate: h.purchaseDate || null,
        type: h.type || 'unknown'
      })),
      totalValue: totalValue,
      createdAt: new Date().toISOString()
    };
    
    portfolios.push(portfolio);
    
    // Save to file
    const fileName = `portfolio_existing_${portfolio.id}.json`;
    const filePath = path.join(PORTFOLIOS_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(portfolio, null, 2), 'utf8');
    
    // Update or create account
    let account = accounts.find(a => a.clientId === clientId);
    if (!account) {
      account = {
        id: Date.now().toString(),
        clientId: clientId,
        existingPortfolios: [],
        proposedPortfolios: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      accounts.push(account);
    }
    
    account.existingPortfolios.push(portfolio.id);
    account.updatedAt = new Date().toISOString();
    
    res.json({
      message: 'Existing portfolio uploaded successfully',
      portfolio: portfolio,
      savedToFile: fileName
    });
  } catch (error) {
    console.error('Error uploading existing portfolio:', error);
    res.status(500).json({ error: error.message });
  }
});

// Compare portfolios
app.post('/api/portfolios/compare', async (req, res) => {
  try {
    const { existingPortfolioId, proposedPortfolioId } = req.body;
    
    if (!existingPortfolioId || !proposedPortfolioId) {
      return res.status(400).json({ 
        error: 'Both existingPortfolioId and proposedPortfolioId are required' 
      });
    }
    
    const existingPortfolio = portfolios.find(p => p.id === existingPortfolioId);
    const proposedPortfolio = portfolios.find(p => p.id === proposedPortfolioId);
    
    if (!existingPortfolio || !proposedPortfolio) {
      return res.status(404).json({ error: 'One or both portfolios not found' });
    }
    
    // Build comparison data
    const comparison = {
      existing: {
        id: existingPortfolio.id,
        name: existingPortfolio.name,
        totalValue: existingPortfolio.totalValue,
        holdings: existingPortfolio.holdings,
        holdingsCount: existingPortfolio.holdings.length
      },
      proposed: {
        id: proposedPortfolio.id,
        name: proposedPortfolio.name,
        totalValue: proposedPortfolio.totalValue,
        holdings: proposedPortfolio.holdings,
        holdingsCount: proposedPortfolio.holdings.length
      },
      differences: {
        valueChange: proposedPortfolio.totalValue - existingPortfolio.totalValue,
        valueChangePercent: ((proposedPortfolio.totalValue - existingPortfolio.totalValue) / existingPortfolio.totalValue * 100).toFixed(2),
        holdingsCountChange: proposedPortfolio.holdings.length - existingPortfolio.holdings.length
      }
    };
    
    // Analyze holdings differences
    const existingSymbols = new Set(existingPortfolio.holdings.map(h => h.symbol));
    const proposedSymbols = new Set(proposedPortfolio.holdings.map(h => h.symbol));
    
    const addedHoldings = proposedPortfolio.holdings.filter(h => !existingSymbols.has(h.symbol));
    const removedHoldings = existingPortfolio.holdings.filter(h => !proposedSymbols.has(h.symbol));
    const commonSymbols = proposedPortfolio.holdings.filter(h => existingSymbols.has(h.symbol));
    
    comparison.holdingsAnalysis = {
      added: addedHoldings,
      removed: removedHoldings,
      common: commonSymbols,
      addedCount: addedHoldings.length,
      removedCount: removedHoldings.length,
      commonCount: commonSymbols.length
    };
    
    // Calculate allocation changes for common holdings
    comparison.allocationChanges = commonSymbols.map(proposedHolding => {
      const existingHolding = existingPortfolio.holdings.find(h => h.symbol === proposedHolding.symbol);
      
      // Calculate allocation percentages
      const existingAllocation = existingHolding.currentValue 
        ? (existingHolding.currentValue / existingPortfolio.totalValue * 100)
        : (existingHolding.allocation || 0);
      
      const proposedAllocation = proposedHolding.allocation || 
        (proposedHolding.currentValue / proposedPortfolio.totalValue * 100);
      
      return {
        symbol: proposedHolding.symbol,
        name: proposedHolding.name,
        existingAllocation: existingAllocation.toFixed(2),
        proposedAllocation: proposedAllocation.toFixed(2),
        allocationChange: (proposedAllocation - existingAllocation).toFixed(2)
      };
    });
    
    res.json(comparison);
  } catch (error) {
    console.error('Error comparing portfolios:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get historical data for instruments using Twelve Data
app.post('/api/instruments/historical', async (req, res) => {
  try {
    const { symbols, range = '1y' } = req.body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({ error: 'Symbols array is required' });
    }

    // Map range to Twelve Data interval and outputsize
    const rangeMap = {
      '1mo': { interval: '1day', outputsize: 30 },
      '3mo': { interval: '1day', outputsize: 90 },
      '6mo': { interval: '1day', outputsize: 180 },
      '1y': { interval: '1day', outputsize: 365 },
      '5y': { interval: '1week', outputsize: 260 }
    };
    const { interval, outputsize } = rangeMap[range] || rangeMap['1y'];

    const historicalData = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          // Use Twelve Data time_series endpoint for historical data
          const response = await axios.get(`${TWELVE_DATA_BASE_URL}/time_series`, {
            params: {
              symbol: symbol,
              interval: interval,
              outputsize: outputsize,
              apikey: TWELVE_DATA_API_KEY
            },
            timeout: 15000
          });

          const timeSeries = response.data.values;
          
          if (!timeSeries || timeSeries.length === 0) {
            console.error(`No historical data returned for ${symbol}`);
            return {
              symbol,
              data: [],
              error: 'No data available'
            };
          }

          // Twelve Data returns data in descending order, reverse it
          const dataPoints = timeSeries
            .map(point => ({
              date: point.datetime,
              close: parseFloat(point.close)
            }))
            .reverse();

          // Calculate normalized returns (starting at 100)
          if (dataPoints.length === 0) {
            return { symbol, data: [], error: 'No data in range' };
          }

          const firstPrice = dataPoints[0].close;
          const normalizedReturns = dataPoints.map(point => ({
            date: point.date,
            value: ((point.close / firstPrice) * 100).toFixed(2)
          }));

          return {
            symbol,
            data: normalizedReturns
          };
        } catch (error) {
          console.error(`Error fetching historical data for ${symbol}:`, error.message);
          return {
            symbol,
            data: [],
            error: error.message
          };
        }
      })
    );

    res.json({ historicalData });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get instruments from EODHD exchange
app.get('/api/eodhd/instruments/:exchange', async (req, res) => {
  try {
    const { exchange } = req.params;
    
    const response = await axios.get(`${EODHD_BASE_URL}/exchange-symbol-list/${exchange}`, {
      params: {
        api_token: EODHD_API_KEY,
        fmt: 'json'
      },
      timeout: 30000
    });

    const instruments = response.data;
    
    res.json({
      exchange: exchange,
      totalInstruments: instruments.length,
      instruments: instruments
    });
  } catch (error) {
    console.error(`Error fetching EODHD instruments for ${req.params.exchange}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Search EODHD instruments by criteria
app.post('/api/eodhd/instruments/search', async (req, res) => {
  try {
    const { exchange, type, country, search } = req.body;
    
    if (!exchange) {
      return res.status(400).json({ error: 'Exchange parameter is required' });
    }

    const response = await axios.get(`${EODHD_BASE_URL}/exchange-symbol-list/${exchange}`, {
      params: {
        api_token: EODHD_API_KEY,
        fmt: 'json'
      },
      timeout: 30000
    });

    let instruments = response.data;
    
    // Filter by type if specified
    if (type) {
      instruments = instruments.filter(i => i.Type && i.Type.toLowerCase() === type.toLowerCase());
    }
    
    // Filter by country if specified
    if (country) {
      instruments = instruments.filter(i => i.Country && i.Country.toLowerCase() === country.toLowerCase());
    }
    
    // Search by name or code if specified
    if (search) {
      const searchLower = search.toLowerCase();
      instruments = instruments.filter(i => 
        (i.Name && i.Name.toLowerCase().includes(searchLower)) ||
        (i.Code && i.Code.toLowerCase().includes(searchLower)) ||
        (i.Isin && i.Isin.toLowerCase().includes(searchLower))
      );
    }
    
    res.json({
      exchange: exchange,
      filters: { type, country, search },
      totalInstruments: instruments.length,
      instruments: instruments
    });
  } catch (error) {
    console.error('Error searching EODHD instruments:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get available EODHD exchanges
app.get('/api/eodhd/exchanges', (req, res) => {
  // Common exchanges available in EODHD
  const exchanges = [
    { code: 'US', name: 'US Exchanges (NYSE, NASDAQ)', country: 'USA' },
    { code: 'XETRA', name: 'Deutsche Börse XETRA', country: 'Germany' },
    { code: 'LSE', name: 'London Stock Exchange', country: 'UK' },
    { code: 'PA', name: 'Euronext Paris', country: 'France' },
    { code: 'AS', name: 'Euronext Amsterdam', country: 'Netherlands' },
    { code: 'BR', name: 'Euronext Brussels', country: 'Belgium' },
    { code: 'MI', name: 'Borsa Italiana', country: 'Italy' },
    { code: 'SW', name: 'SIX Swiss Exchange', country: 'Switzerland' },
    { code: 'TO', name: 'Toronto Stock Exchange', country: 'Canada' },
    { code: 'V', name: 'TSX Venture Exchange', country: 'Canada' },
    { code: 'HK', name: 'Hong Kong Stock Exchange', country: 'Hong Kong' },
    { code: 'SHG', name: 'Shanghai Stock Exchange', country: 'China' },
    { code: 'SHE', name: 'Shenzhen Stock Exchange', country: 'China' },
    { code: 'T', name: 'Tokyo Stock Exchange', country: 'Japan' },
    { code: 'BSE', name: 'Bombay Stock Exchange', country: 'India' },
    { code: 'NSE', name: 'National Stock Exchange of India', country: 'India' },
    { code: 'ASX', name: 'Australian Securities Exchange', country: 'Australia' }
  ];
  
  res.json({ exchanges });
});

// Get all tenants
app.get('/api/tenants', (req, res) => {
  const tenants = Object.keys(riskConfigurations).map(key => ({
    id: key,
    name: riskConfigurations[key].name,
    description: riskConfigurations[key].description
  }));
  res.json({ tenants });
});

// Get risk configuration for a specific tenant
app.get('/api/risk-configuration/:tenant', (req, res) => {
  const { tenant } = req.params;
  
  if (!riskConfigurations[tenant]) {
    return res.status(404).json({ error: `Tenant not found: ${tenant}` });
  }
  
  res.json({
    tenant,
    ...riskConfigurations[tenant]
  });
});

// Get all risk configurations
app.get('/api/risk-configuration', (req, res) => {
  res.json(riskConfigurations);
});

// Update risk configuration for a specific tenant
app.put('/api/risk-configuration/:tenant', (req, res) => {
  try {
    const { tenant } = req.params;
    const newConfig = req.body;
    
    // Validate configuration structure
    if (!newConfig.scoringRules || !newConfig.riskLevels) {
      return res.status(400).json({ error: 'Invalid configuration structure' });
    }
    
    riskConfigurations[tenant] = {
      name: newConfig.name || riskConfigurations[tenant]?.name || tenant,
      description: newConfig.description || riskConfigurations[tenant]?.description || '',
      scoringRules: newConfig.scoringRules,
      riskLevels: newConfig.riskLevels
    };
    
    res.json({ 
      message: `Risk configuration for ${tenant} updated successfully`,
      configuration: riskConfigurations[tenant]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new tenant configuration
app.post('/api/risk-configuration/:tenant', (req, res) => {
  try {
    const { tenant } = req.params;
    const newConfig = req.body;
    
    if (riskConfigurations[tenant]) {
      return res.status(400).json({ error: `Tenant ${tenant} already exists. Use PUT to update.` });
    }
    
    // Validate configuration structure
    if (!newConfig.scoringRules || !newConfig.riskLevels) {
      return res.status(400).json({ error: 'Invalid configuration structure' });
    }
    
    riskConfigurations[tenant] = {
      name: newConfig.name || tenant,
      description: newConfig.description || '',
      scoringRules: newConfig.scoringRules,
      riskLevels: newConfig.riskLevels
    };
    
    res.status(201).json({ 
      message: `Tenant ${tenant} created successfully`,
      configuration: riskConfigurations[tenant]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete tenant configuration
app.delete('/api/risk-configuration/:tenant', (req, res) => {
  const { tenant } = req.params;
  
  if (!riskConfigurations[tenant]) {
    return res.status(404).json({ error: `Tenant not found: ${tenant}` });
  }
  
  if (tenant === 'retail' || tenant === 'private_banking') {
    return res.status(400).json({ error: 'Cannot delete default tenants' });
  }
  
  delete riskConfigurations[tenant];
  
  res.json({ message: `Tenant ${tenant} deleted successfully` });
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'mifid-backend'
  });
});

app.listen(PORT, () => {
  console.log(`MiFID II Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
