#!/usr/bin/env node

/**
 * API Key Generator for MiFID II Backend
 * 
 * Usage: node generateApiKey.js [client-name]
 * Example: node generateApiKey.js "Acme Financial Services"
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a secure random API key
function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

// Generate client ID
function generateClientId() {
  return `client_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

// Load existing API keys
function loadApiKeys() {
  const keysPath = path.join(__dirname, 'api-keys.json');
  if (fs.existsSync(keysPath)) {
    return JSON.parse(fs.readFileSync(keysPath, 'utf8'));
  }
  return { keys: [] };
}

// Save API keys
function saveApiKeys(data) {
  const keysPath = path.join(__dirname, 'api-keys.json');
  fs.writeFileSync(keysPath, JSON.stringify(data, null, 2));
}

// Main function
function main() {
  const clientName = process.argv[2];
  
  if (!clientName) {
    console.error('❌ Error: Client name is required');
    console.log('\nUsage: node generateApiKey.js [client-name]');
    console.log('Example: node generateApiKey.js "Acme Financial Services"');
    process.exit(1);
  }

  // Generate new API key
  const apiKey = generateApiKey();
  const clientId = generateClientId();
  const createdAt = new Date().toISOString();

  // Load existing keys
  const data = loadApiKeys();

  // Add new key
  const newKey = {
    clientId,
    clientName,
    apiKey,
    createdAt,
    active: true,
    lastUsed: null,
    requestCount: 0
  };

  data.keys.push(newKey);

  // Save to file
  saveApiKeys(data);

  // Display success message
  console.log('\n✅ API Key Generated Successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Client Name:  ${clientName}`);
  console.log(`Client ID:    ${clientId}`);
  console.log(`API Key:      ${apiKey}`);
  console.log(`Created:      ${createdAt}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚠️  IMPORTANT: Save this API key securely. It will not be shown again.\n');
  console.log('📝 Usage Instructions:');
  console.log('   Add this header to all API requests:');
  console.log(`   X-API-Key: ${apiKey}\n`);
  console.log('   Example with curl:');
  console.log(`   curl -H "X-API-Key: ${apiKey}" \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -X POST http://localhost:5001/api/clients \\');
  console.log('        -d \'{"personalInfo": {...}}\'\n');
  console.log('📊 Total API Keys: ' + data.keys.length);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateApiKey, generateClientId, loadApiKeys, saveApiKeys };
