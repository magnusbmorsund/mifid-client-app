#!/usr/bin/env node

/**
 * API Key Management Tool
 * 
 * Commands:
 *   node manageApiKeys.js list              - List all API keys
 *   node manageApiKeys.js revoke [key]      - Revoke an API key
 *   node manageApiKeys.js activate [key]    - Activate an API key
 *   node manageApiKeys.js stats             - Show usage statistics
 */

const fs = require('fs');
const path = require('path');

// Load API keys
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

// List all API keys
function listKeys() {
  const data = loadApiKeys();
  
  if (data.keys.length === 0) {
    console.log('\n📋 No API keys found. Generate one with: node generateApiKey.js [client-name]\n');
    return;
  }

  console.log('\n📋 API Keys List\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  data.keys.forEach((key, index) => {
    const status = key.active ? '✅ Active' : '❌ Revoked';
    const lastUsed = key.lastUsed ? new Date(key.lastUsed).toLocaleString() : 'Never';
    
    console.log(`\n${index + 1}. ${key.clientName}`);
    console.log(`   Client ID:    ${key.clientId}`);
    console.log(`   API Key:      ${key.apiKey.substring(0, 16)}...${key.apiKey.substring(key.apiKey.length - 8)}`);
    console.log(`   Status:       ${status}`);
    console.log(`   Created:      ${new Date(key.createdAt).toLocaleString()}`);
    console.log(`   Last Used:    ${lastUsed}`);
    console.log(`   Requests:     ${key.requestCount}`);
  });
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\nTotal: ${data.keys.length} API key(s) | Active: ${data.keys.filter(k => k.active).length} | Revoked: ${data.keys.filter(k => !k.active).length}\n`);
}

// Revoke an API key
function revokeKey(apiKey) {
  if (!apiKey) {
    console.error('❌ Error: API key is required');
    console.log('Usage: node manageApiKeys.js revoke [api-key]');
    return;
  }

  const data = loadApiKeys();
  const key = data.keys.find(k => k.apiKey === apiKey);

  if (!key) {
    console.error('❌ Error: API key not found');
    return;
  }

  if (!key.active) {
    console.log('⚠️  API key is already revoked');
    return;
  }

  key.active = false;
  key.revokedAt = new Date().toISOString();
  saveApiKeys(data);

  console.log('\n✅ API Key Revoked Successfully\n');
  console.log(`Client: ${key.clientName}`);
  console.log(`Key: ${apiKey.substring(0, 16)}...${apiKey.substring(apiKey.length - 8)}`);
  console.log(`Revoked: ${key.revokedAt}\n`);
}

// Activate an API key
function activateKey(apiKey) {
  if (!apiKey) {
    console.error('❌ Error: API key is required');
    console.log('Usage: node manageApiKeys.js activate [api-key]');
    return;
  }

  const data = loadApiKeys();
  const key = data.keys.find(k => k.apiKey === apiKey);

  if (!key) {
    console.error('❌ Error: API key not found');
    return;
  }

  if (key.active) {
    console.log('⚠️  API key is already active');
    return;
  }

  key.active = true;
  delete key.revokedAt;
  saveApiKeys(data);

  console.log('\n✅ API Key Activated Successfully\n');
  console.log(`Client: ${key.clientName}`);
  console.log(`Key: ${apiKey.substring(0, 16)}...${apiKey.substring(apiKey.length - 8)}\n`);
}

// Show statistics
function showStats() {
  const data = loadApiKeys();

  if (data.keys.length === 0) {
    console.log('\n📊 No API keys found\n');
    return;
  }

  const totalRequests = data.keys.reduce((sum, key) => sum + key.requestCount, 0);
  const activeKeys = data.keys.filter(k => k.active).length;
  const revokedKeys = data.keys.filter(k => !k.active).length;
  const usedKeys = data.keys.filter(k => k.lastUsed).length;

  console.log('\n📊 API Usage Statistics\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total API Keys:        ${data.keys.length}`);
  console.log(`Active Keys:           ${activeKeys}`);
  console.log(`Revoked Keys:          ${revokedKeys}`);
  console.log(`Keys Ever Used:        ${usedKeys}`);
  console.log(`Total Requests:        ${totalRequests.toLocaleString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (data.keys.length > 0) {
    console.log('Top 5 Most Used Keys:\n');
    const sorted = [...data.keys].sort((a, b) => b.requestCount - a.requestCount).slice(0, 5);
    sorted.forEach((key, index) => {
      console.log(`${index + 1}. ${key.clientName}`);
      console.log(`   Requests: ${key.requestCount.toLocaleString()}`);
      console.log(`   Last Used: ${key.lastUsed ? new Date(key.lastUsed).toLocaleString() : 'Never'}\n`);
    });
  }
}

// Main function
function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'list':
      listKeys();
      break;
    case 'revoke':
      revokeKey(arg);
      break;
    case 'activate':
      activateKey(arg);
      break;
    case 'stats':
      showStats();
      break;
    default:
      console.log('\n📚 API Key Management Tool\n');
      console.log('Commands:');
      console.log('  node manageApiKeys.js list              - List all API keys');
      console.log('  node manageApiKeys.js revoke [key]      - Revoke an API key');
      console.log('  node manageApiKeys.js activate [key]    - Activate an API key');
      console.log('  node manageApiKeys.js stats             - Show usage statistics\n');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { listKeys, revokeKey, activateKey, showStats };
