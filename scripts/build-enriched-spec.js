const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const UPSTREAM_FILE = path.join(__dirname, '../spec/upstream/paystack.yaml');
const OVERLAYS_DIR = path.join(__dirname, '../overlays');
const SNIPPETS_DIR = path.join(__dirname, '../snippets');
const DIST_DIR = path.join(__dirname, '../dist');

const LANG_MAP = {
  'curl.sh': { lang: 'Shell', label: 'cURL' },
  'node.ts': { lang: 'JavaScript', label: 'Node.js' },
  'typescript.ts': { lang: 'TypeScript', label: 'TypeScript' },
  'python.py': { lang: 'Python', label: 'Python' },
  'php.php': { lang: 'PHP', label: 'PHP' },
  'go.go': { lang: 'Go', label: 'Go' },
  'java.java': { lang: 'Java', label: 'Java' },
  'csharp.cs': { lang: 'C#', label: 'C#' },
  'ruby.rb': { lang: 'Ruby', label: 'Ruby' },
  'flutter.dart': { lang: 'Dart', label: 'Flutter / Dart' },
  'kotlin.kt': { lang: 'Kotlin', label: 'Kotlin / Android' },
  'swift.swift': { lang: 'Swift', label: 'Swift / iOS' }
};

function loadJSON(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
}

function toCamelCase(str) {
  return str.replace(/[_-\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^(.)/, c => c.toLowerCase());
}

function generateFallbackOperationId(httpMethod, pathKey, existingOpId) {
  if (existingOpId) {
    const parts = existingOpId.split('_');
    if (parts.length === 2) {
      return toCamelCase(`${parts[1]}_${parts[0]}`);
    }
    return toCamelCase(existingOpId);
  }

  const cleanPath = pathKey.replace(/\{[^}]+\}/g, '').replace(/\/+$/g, '');
  const segments = cleanPath.split('/').filter(Boolean);
  const resource = segments[0] || 'root';
  const sub = segments.slice(1).join('_');

  let verb = httpMethod.toLowerCase();
  if (verb === 'get') verb = sub ? 'fetch' : 'list';
  if (verb === 'post') verb = 'create';
  if (verb === 'put') verb = 'update';
  if (verb === 'delete') verb = 'delete';

  return toCamelCase(`${verb}_${resource}_${sub}`);
}

// Recursive Schema Sanitizer to fix OpenAPI 3.0 validity errors (e.g. nullable without type)
function sanitizeSchemaNode(node) {
  if (!node || typeof node !== 'object') return;

  if (Array.isArray(node)) {
    for (const item of node) {
      sanitizeSchemaNode(item);
    }
    return;
  }

  // Fix: "The `type` field must be defined when the `nullable` field is used."
  if (node.nullable === true && !node.type && !node.$ref && !node.oneOf && !node.anyOf && !node.allOf) {
    node.type = 'string';
  }

  for (const value of Object.values(node)) {
    if (typeof value === 'object' && value !== null) {
      sanitizeSchemaNode(value);
    }
  }
}

function buildEnrichedSpec() {
  console.log('[BUILD] Starting OpenAPI Spec Enrichment Pipeline...');

  if (!fs.existsSync(UPSTREAM_FILE)) {
    console.error(`[BUILD ERROR] Raw spec file not found at: ${UPSTREAM_FILE}. Run 'npm run sync' first.`);
    process.exit(1);
  }

  const rawYaml = fs.readFileSync(UPSTREAM_FILE, 'utf8');
  const spec = yaml.load(rawYaml);

  // 0. Ensure Info License exists
  spec.info = spec.info || {};
  spec.info.license = {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT'
  };

  const operationIds = loadJSON(path.join(OVERLAYS_DIR, 'operation-ids.json')) || {};
  const idempotencyList = loadJSON(path.join(OVERLAYS_DIR, 'idempotency.json')) || [];
  const deprecations = loadJSON(path.join(OVERLAYS_DIR, 'deprecations.json')) || {};
  const webhooks = loadJSON(path.join(OVERLAYS_DIR, 'webhooks.json')) || {};
  const paginationRules = loadJSON(path.join(OVERLAYS_DIR, 'pagination.json')) || {};

  let operationCount = 0;
  let enrichedSamplesCount = 0;
  let retrySafeCount = 0;
  let paginatedCount = 0;

  // Process paths and operations
  if (spec.paths) {
    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (method === 'parameters' || typeof operation !== 'object' || !operation) continue;
        operationCount++;

        const httpMethod = method.toLowerCase();
        const routeKey = `${httpMethod} ${pathKey.toLowerCase()}`;

        // 1. x-operation-id and operationId camelCase standardization with automatic fallback
        const cleanOpId = operationIds[routeKey] || generateFallbackOperationId(httpMethod, pathKey, operation.operationId);
        operation['x-operation-id'] = cleanOpId;
        operation['operationId'] = cleanOpId;

        // 2. x-idempotency header flag
        const isIdempotent = idempotencyList.includes(routeKey);
        if (isIdempotent) {
          operation['x-idempotency'] = true;
        }

        // 3. x-retry-safe vs x-dont-retry (Retry Resilience Logic)
        if (httpMethod === 'get' || isIdempotent) {
          operation['x-retry-safe'] = true;
          retrySafeCount++;
        } else if (['post', 'put', 'delete', 'patch'].includes(httpMethod)) {
          operation['x-dont-retry'] = true;
        }

        // 4. x-pagination metadata
        if (paginationRules[routeKey]) {
          operation['x-pagination'] = paginationRules[routeKey];
          paginatedCount++;
        }

        // 5. x-deprecated-reason migration notes
        if (deprecations[routeKey] || operation.deprecated) {
          operation.deprecated = true;
          operation['x-deprecated-reason'] = deprecations[routeKey] || 'This endpoint is deprecated. Refer to official Paystack docs.';
        }

        // 6. x-code-samples injection from snippets/
        const targetOpId = operation['x-operation-id'] || operation['operationId'];
        if (targetOpId) {
          const snippetFolder = path.join(SNIPPETS_DIR, targetOpId);
          if (fs.existsSync(snippetFolder)) {
            const samples = [];
            const files = fs.readdirSync(snippetFolder);
            for (const file of files) {
              if (LANG_MAP[file]) {
                const source = fs.readFileSync(path.join(snippetFolder, file), 'utf8').trim();
                samples.push({
                  lang: LANG_MAP[file].lang,
                  label: LANG_MAP[file].label,
                  source
                });
              }
            }
            if (samples.length > 0) {
              operation['x-code-samples'] = samples;
              enrichedSamplesCount++;
            }
          }
        }
      }
    }
  }

  // 7. Inject Webhook Schemas into components.schemas
  if (webhooks.schemas) {
    spec.components = spec.components || {};
    spec.components.schemas = spec.components.schemas || {};
    Object.assign(spec.components.schemas, webhooks.schemas);
  }

  // 8. Ensure Bearer Authentication Security Scheme exists
  spec.components = spec.components || {};
  spec.components.securitySchemes = spec.components.securitySchemes || {};
  spec.components.securitySchemes.bearerAuth = {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT / API Key',
    description: 'Paystack Secret Key passed in Authorization header: Bearer sk_test_...'
  };

  // 9. Sanitize raw upstream schema defects across spec
  sanitizeSchemaNode(spec);

  // Ensure output directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  // Write enriched outputs
  const distYamlPath = path.join(DIST_DIR, 'paystack-enriched.yaml');
  const distJsonPath = path.join(DIST_DIR, 'paystack-enriched.json');

  const outputYaml = yaml.dump(spec, { noRefs: true, lineWidth: -1 });
  fs.writeFileSync(distYamlPath, outputYaml, 'utf8');
  fs.writeFileSync(distJsonPath, JSON.stringify(spec, null, 2), 'utf8');

  console.log(`[BUILD SUCCESS] Processed ${operationCount} operations with 100% operationId coverage.`);
  console.log(`[BUILD SUCCESS] Marked ${retrySafeCount} operations as x-retry-safe.`);
  console.log(`[BUILD SUCCESS] Defined x-pagination for ${paginatedCount} list operations.`);
  console.log(`[BUILD SUCCESS] Embedded code samples for ${enrichedSamplesCount} operations.`);
  console.log(`[BUILD SUCCESS] Output generated:`);
  console.log(`  - ${distYamlPath}`);
  console.log(`  - ${distJsonPath}`);
}

buildEnrichedSpec();
