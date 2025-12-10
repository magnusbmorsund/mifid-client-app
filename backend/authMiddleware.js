/**
 * API Key Authentication Middleware
 * 
 * This middleware validates API keys for protected endpoints
 */

const fs = require('fs');
const path = require('path');

// Load API keys from file
function loadApiKeys() {
  const keysPath = path.join(__dirname, 'api-keys.json');
  if (fs.existsSync(keysPath)) {
    try {
      return JSON.parse(fs.readFileSync(keysPath, 'utf8'));
    } catch (error) {
      console.error('Error loading API keys:', error);
      return { keys: [] };
    }
  }
  return { keys: [] };
}

// Save API keys to file
function saveApiKeys(data) {
  const keysPath = path.join(__dirname, 'api-keys.json');
  try {
    fs.writeFileSync(keysPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving API keys:', error);
  }
}

// Update key usage statistics
function updateKeyUsage(apiKey) {
  const data = loadApiKeys();
  const key = data.keys.find(k => k.apiKey === apiKey);
  
  if (key) {
    key.lastUsed = new Date().toISOString();
    key.requestCount = (key.requestCount || 0) + 1;
    saveApiKeys(data);
  }
}

/**
 * Authentication middleware
 * Validates API key from X-API-Key header
 */
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  // Check if API key is provided
  if (!apiKey) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'API key is missing. Please provide X-API-Key header.',
      documentation: 'Run "node generateApiKey.js [client-name]" to generate an API key'
    });
  }

  // Load and validate API key
  const data = loadApiKeys();
  const keyData = data.keys.find(k => k.apiKey === apiKey);

  if (!keyData) {
    return res.status(401).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid.',
      documentation: 'Contact administrator for a valid API key'
    });
  }

  // Check if key is active
  if (!keyData.active) {
    return res.status(403).json({
      error: 'API key revoked',
      message: 'This API key has been revoked and is no longer valid.',
      revokedAt: keyData.revokedAt,
      documentation: 'Contact administrator for a new API key'
    });
  }

  // Update usage statistics asynchronously
  setImmediate(() => updateKeyUsage(apiKey));

  // Attach client info to request
  req.apiClient = {
    clientId: keyData.clientId,
    clientName: keyData.clientName,
    apiKey: apiKey
  };

  next();
}

/**
 * Optional authentication middleware
 * Allows requests without API key but attaches client info if provided
 */
function optionalAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next();
  }

  const data = loadApiKeys();
  const keyData = data.keys.find(k => k.apiKey === apiKey && k.active);

  if (keyData) {
    setImmediate(() => updateKeyUsage(apiKey));
    req.apiClient = {
      clientId: keyData.clientId,
      clientName: keyData.clientName,
      apiKey: apiKey
    };
  }

  next();
}

/**
 * Rate limiting per API key
 */
const keyRateLimits = new Map();

function rateLimitByKey(maxRequests = 100, windowMs = 60000) {
  return (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return next();
    }

    const now = Date.now();
    const keyLimit = keyRateLimits.get(apiKey) || { count: 0, resetTime: now + windowMs };

    // Reset if window expired
    if (now > keyLimit.resetTime) {
      keyLimit.count = 0;
      keyLimit.resetTime = now + windowMs;
    }

    keyLimit.count++;
    keyRateLimits.set(apiKey, keyLimit);

    // Check if limit exceeded
    if (keyLimit.count > maxRequests) {
      const resetIn = Math.ceil((keyLimit.resetTime - now) / 1000);
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Too many requests. Limit: ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        retryAfter: resetIn,
        limit: maxRequests,
        remaining: 0,
        resetTime: new Date(keyLimit.resetTime).toISOString()
      });
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - keyLimit.count);
    res.setHeader('X-RateLimit-Reset', new Date(keyLimit.resetTime).toISOString());

    next();
  };
}

module.exports = {
  authenticateApiKey,
  optionalAuth,
  rateLimitByKey,
  loadApiKeys,
  saveApiKeys
};
