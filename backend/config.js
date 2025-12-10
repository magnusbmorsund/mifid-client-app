// Configuration file for easy customization
// Edit this file to change instruments, risk thresholds, and other settings

module.exports = {
  // Risk Score Thresholds (0-100)
  riskThresholds: {
    veryHigh: 85,      // 85+ = Risk Level 7
    high: 70,          // 70-84 = Risk Level 6
    moderateHigh: 55,  // 55-69 = Risk Level 5
    moderate: 40,      // 40-54 = Risk Level 4
    lowModerate: 25,   // 25-39 = Risk Level 3
    low: 15,           // 15-24 = Risk Level 2
    // <15 = Risk Level 1
  },

  // Investment Instrument Universe
  // Add or remove symbols as needed
  instruments: {
    // Norwegian Stocks (Oslo Børs)
    norwegian_stocks: [
      'EQNR.OL',   // Equinor
      'DNB.OL',    // DNB Bank
      'YAR.OL',    // Yara
      'MOWI.OL',   // Mowi
      'TEL.OL',    // Telenor
      'ORK.OL',    // Orkla
      'SALM.OL',   // SalMar
      'NHY.OL',    // Norsk Hydro
      'AKRBP.OL',  // Aker BP
    ],

    // US Large Cap Stocks
    us_large_cap: [
      'AAPL',   // Apple
      'MSFT',   // Microsoft
      'GOOGL',  // Alphabet
      'AMZN',   // Amazon
      'NVDA',   // Nvidia
      'META',   // Meta
      'TSLA',   // Tesla
      'BRK-B',  // Berkshire Hathaway
      'JPM',    // JPMorgan
      'V',      // Visa
    ],

    // US Tech Stocks
    us_tech: [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 
      'NFLX', 'AMD', 'INTC', 'CSCO', 'ORCL', 'CRM'
    ],

    // Bond ETFs
    bonds: [
      'TLT',   // Long-term Treasury
      'AGG',   // Aggregate Bond
      'BND',   // Total Bond Market
      'LQD',   // Investment Grade Corporate
      'HYG',   // High Yield Corporate
      'TIP',   // Inflation Protected
      'MUB',   // Municipal Bonds
    ],

    // Equity ETFs
    equity_etfs: [
      'SPY',   // S&P 500
      'VOO',   // Vanguard S&P 500
      'VTI',   // Total US Market
      'QQQ',   // Nasdaq 100
      'IWM',   // Russell 2000
      'DIA',   // Dow Jones
      'VEA',   // Developed Markets ex-US
      'VWO',   // Emerging Markets
      'EFA',   // EAFE
    ],

    // Sector ETFs
    sector_etfs: [
      'XLF',   // Financials
      'XLK',   // Technology
      'XLE',   // Energy
      'XLV',   // Healthcare
      'XLI',   // Industrials
      'XLP',   // Consumer Staples
      'XLY',   // Consumer Discretionary
      'XLU',   // Utilities
      'XLRE',  // Real Estate
    ],

    // Commodities
    commodities: [
      'GLD',   // Gold
      'SLV',   // Silver
      'USO',   // Oil
      'DBC',   // Diversified Commodities
      'PDBC',  // Optimized Commodities
    ],

    // Cryptocurrencies
    crypto: [
      'BTC-USD',   // Bitcoin
      'ETH-USD',   // Ethereum
      'BNB-USD',   // Binance Coin
      'ADA-USD',   // Cardano
      'SOL-USD',   // Solana
    ],

    // REITs
    reits: [
      'VNQ',   // Vanguard Real Estate
      'IYR',   // iShares Real Estate
      'SCHH',  // Schwab Real Estate
    ],

    // Dividend Stocks
    dividend_stocks: [
      'JNJ',   // Johnson & Johnson
      'PG',    // Procter & Gamble
      'KO',    // Coca-Cola
      'PEP',   // PepsiCo
      'MCD',   // McDonald's
    ],

    // International
    international: [
      'EWJ',   // Japan
      'EWG',   // Germany
      'EWU',   // UK
      'FXI',   // China Large Cap
      'EWZ',   // Brazil
      'INDA',  // India
    ],
  },

  // Risk Level to Allowed Instrument Mapping
  allowedInstrumentsByRisk: {
    1: ['bonds', 'equity_etfs'],  // Very Low Risk
    2: ['bonds', 'equity_etfs', 'dividend_stocks'],  // Low Risk
    3: ['bonds', 'equity_etfs', 'dividend_stocks', 'reits'],  // Low-Moderate
    4: ['bonds', 'equity_etfs', 'us_large_cap', 'norwegian_stocks', 'sector_etfs', 'reits'],  // Moderate
    5: ['bonds', 'equity_etfs', 'us_large_cap', 'us_tech', 'norwegian_stocks', 'sector_etfs', 'reits', 'international'],  // Moderate-High
    6: ['bonds', 'equity_etfs', 'us_large_cap', 'us_tech', 'norwegian_stocks', 'sector_etfs', 'reits', 'international', 'commodities'],  // High
    7: ['bonds', 'equity_etfs', 'us_large_cap', 'us_tech', 'norwegian_stocks', 'sector_etfs', 'reits', 'international', 'commodities', 'crypto'],  // Very High
  },

  // Financial Situation Score Weights
  financialWeights: {
    investableAssets: {
      high: { threshold: 1000000, points: 10 },
      medium: { threshold: 250000, points: 7 },
      low: { threshold: 50000, points: 4 },
      veryLow: { points: 1 }
    },
    income: {
      high: { threshold: 200000, points: 10 },
      medium: { threshold: 100000, points: 7 },
      low: { threshold: 50000, points: 4 },
      veryLow: { points: 2 }
    },
    netWorth: {
      high: { threshold: 2000000, points: 10 },
      medium: { threshold: 500000, points: 7 },
      low: { threshold: 100000, points: 4 },
      veryLow: { points: 2 }
    }
  },

  // Knowledge & Experience Weights
  knowledgeWeights: {
    yearsInvesting: {
      expert: { threshold: 10, points: 15 },
      experienced: { threshold: 5, points: 10 },
      intermediate: { threshold: 2, points: 5 },
      beginner: { points: 2 }
    },
    education: {
      professional: { value: 'professional', points: 10 },
      financedegree: { value: 'finance_degree', points: 10 },
      university: { value: 'university', points: 5 },
      other: { points: 2 }
    }
  },

  // Server Configuration
  server: {
    port: 5001,
    corsOrigins: ['http://localhost:3000'],
    requestTimeout: 5000
  },

  // API Configuration (Hybrid Approach)
  api: {
    // Finnhub - Real-time quotes (60 calls/min)
    finnhub: {
      baseUrl: 'https://finnhub.io/api/v1',
      endpoints: {
        quote: '/quote',
        profile: '/stock/profile2',
        news: '/company-news',
        earnings: '/stock/earnings',
        metrics: '/stock/metric'
      },
      rateLimit: {
        callsPerMinute: 60,
        delayBetweenCalls: 1100 // milliseconds
      },
      usage: 'Real-time stock quotes with 15-min delay'
    },
    // Twelve Data - Historical data (800 calls/day)
    twelveData: {
      baseUrl: 'https://api.twelvedata.com',
      endpoints: {
        timeSeries: '/time_series',
        quote: '/quote',
        stocks: '/stocks',
        etf: '/etf'
      },
      rateLimit: {
        callsPerDay: 800
      },
      usage: 'Historical price data and charts'
    }
  }
};
