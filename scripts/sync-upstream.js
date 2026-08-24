const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

const UPSTREAM_URL = 'https://raw.githubusercontent.com/PaystackOSS/openapi/main/dist/paystack.yaml';
const OUTPUT_DIR = path.join(__dirname, '../spec/upstream');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'paystack.yaml');

function getHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function syncUpstream() {
  console.log(`[SYNC] Fetching raw Paystack OpenAPI spec from: ${UPSTREAM_URL}...`);
  
  try {
    const response = await axios.get(UPSTREAM_URL, { responseType: 'text' });
    const newContent = response.data;
    const newHash = getHash(newContent);

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    if (fs.existsSync(OUTPUT_FILE)) {
      const existingContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
      const existingHash = getHash(existingContent);

      if (newHash === existingHash) {
        console.log('[SYNC] Upstream spec is already up to date. (SHA256 match)');
        return;
      }
    }

    fs.writeFileSync(OUTPUT_FILE, newContent, 'utf8');
    console.log(`[SYNC] Successfully synced raw spec to: ${OUTPUT_FILE} (SHA256: ${newHash.substring(0, 8)})`);
  } catch (error) {
    console.error('[SYNC ERROR] Failed to fetch upstream spec:', error.message);
    process.exit(1);
  }
}

syncUpstream();
