# Integrating `paystack-spec-enriched` Across Tooling

This document explains how **`paystack-sdk-gen`** (SDK Generator), **`paystack-cli`** (Command Line Interface), and **`paystack-docs`** (Interactive Documentation Portal) consume the single source of truth: `dist/paystack-enriched.json` (and `dist/paystack-enriched.yaml`).

---

## Architecture Overview

```
                      PaystackOSS/openapi (Upstream Raw Spec)
                                       │
                                       ▼ (npm run sync & npm run build)
                           paystack-spec-enriched
                   (dist/paystack-enriched.json & yaml)
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           ▼                           ▼                           ▼
    paystack-sdk-gen             paystack-cli               paystack-docs
 (TypeScript, Python, Go,    (Command Line Interface)    (Interactive API Explorer
   Java, PHP SDK Outputs)                                  & 12-Lang Code Tabs)
```

---

## 1. SDK Generator (`paystack-sdk-gen`)

The multi-language SDK generator reads `dist/paystack-enriched.json` to produce idiomatic, resilient SDKs across target languages (TypeScript, Python, Go, Java, PHP).

### Key Integration Points:

- **Method Naming (`x-operation-id`)**:
  Uses clean camelCase operation IDs to construct object-oriented SDK methods:
  - `POST /transaction/initialize` $\rightarrow$ `paystack.transactions.initialize(...)`
  - `POST /customer` $\rightarrow$ `paystack.customers.create(...)`
  - `POST /transfer` $\rightarrow$ `paystack.transfers.initiate(...)`

- **Automated Idempotency (`x-idempotency: true`)**:
  SDK client middleware automatically injects a `X-Idempotency-Key` header (UUID4) on resource creation and financial mutation endpoints if the developer does not explicitly pass one.

- **Resilience & Auto-Retry Loop (`x-retry-safe: true` vs `x-dont-retry: true`)**:
  SDK HTTP clients automatically retry transient network errors, rate limits (429), and 5xx server errors for GET operations and idempotent POSTs (`x-retry-safe`), while suppressing auto-retries on state-mutating actions (`x-dont-retry`) to prevent duplicate transactions.

- **Auto-Paging Generators (`x-pagination`)**:
  Generates async iterators for collection endpoints so developers can iterate through thousands of list records seamlessly:
  ```typescript
  for await (const transaction of paystack.transactions.listAutoPaging()) {
    console.log(transaction.id);
  }
  ```

- **IDE Docstrings & Hover Examples (`x-code-samples`)**:
  Embeds runnable code samples directly into JSDoc, PyDoc, GoDoc, and PHPDoc comments for instant developer guidance inside VS Code and IntelliJ.

- **Typed Webhook Deserialization (`WebhookEvent`)**:
  Emits typed event models so developers can safely parse incoming webhooks:
  ```typescript
  const event = paystack.webhooks.constructEvent(payload, signature, secret);
  if (event.event === 'charge.success') {
    // event.data is strongly typed as ChargeSuccessData
  }
  ```

---

## 2. Paystack CLI (`paystack-cli`)

The CLI consumes `dist/paystack-enriched.json` to provide a scriptable command-line developer tool modeled after the Stripe CLI.

### Key Integration Points:

- **Dynamic Command Dispatch**:
  Routes subcommands based on resource tags and `x-operation-id`:
  ```bash
  paystack transactions initialize --email="user@test.com" --amount=50000
  paystack customers create --email="alex@example.com" --first-name="Alex"
  paystack transfers initiate --amount=50000 --recipient="RCP_123"
  ```

- **Flag Parsing & Schema Validation**:
  Converts OpenAPI request parameters and body properties into CLI flags with strict type checking (integer, boolean, string, enum).

- **Webhook Listening & Simulation (`paystack listen` & `paystack trigger`)**:
  Uses `WebhookEvent` schemas to validate, log, and forward webhooks to local dev servers (`localhost:3000/api/webhooks`) and trigger test events:
  ```bash
  paystack trigger charge.success
  ```

---

## 3. Developer Portal & Interactive Docs (`paystack-docs`)

The documentation site imports `dist/paystack-enriched.yaml` at build-time or runtime to render an interactive Stripe-grade API Explorer.

### Key Integration Points:

- **12-Language Code Sample Tabs (`x-code-samples`)**:
  Displays code sample tabs in the right-hand panel for **cURL, Node.js, TypeScript, Python, PHP, Go, Java, C#, Ruby, Flutter / Dart, Kotlin / Android, and Swift / iOS**.

- **Dynamic Form Generation**:
  Builds interactive form inputs directly from OpenAPI request schemas so developers can test endpoints directly in their browser.

- **Live Sandbox Execution & Response Inspector**:
  Executes test requests against Paystack test mode or Prism mock servers (`http://127.0.0.1:4010`) and displays JSON response bodies with status codes and response headers.

- **Schema Navigation & Polymorphic Webhooks**:
  Displays detailed field descriptions, enums, required fields, and polymorphic webhook payload models for easy integration.

---

## Summary Matrix

| Feature / Metadata | `paystack-sdk-gen` Impact | `paystack-cli` Impact | `paystack-docs` Impact |
| :--- | :--- | :--- | :--- |
| **`x-operation-id`** | Idiomatic SDK method names | Clean CLI subcommands | Endpoint route headers & titles |
| **`x-idempotency`** | Auto `X-Idempotency-Key` UUID generation | CLI auto-idempotency headers | Form key generator & docs notice |
| **`x-retry-safe`** | SDK auto-retry loop for transient 5xx/429 | Resilient CLI network retries | Retry safety badge in UI |
| **`x-pagination`** | Auto-paginating iterators | `--page` / `--limit` flags | Collection pagination guide |
| **`x-code-samples`** | IDE hover docstrings | `--example` command helper | 12-Language interactive code tabs |
| **`WebhookEvent`** | Strongly-typed event deserializers | `paystack trigger` payload schemas | Webhook documentation & schema viewer |
