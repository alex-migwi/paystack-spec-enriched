# Paystack Enriched OpenAPI Spec (`paystack-spec-enriched`)

This repository serves as the single source of truth for the **Enriched Paystack OpenAPI Specification**. It synchronizes with the official `PaystackOSS/openapi` repository, applies structural, resilience, and developer-experience enrichments (`x-code-samples`, `x-operation-id`, `x-idempotency`, `x-retry-safe`, `x-dont-retry`, `x-pagination`, `x-deprecated-reason`, polymorphic webhook event schemas), and outputs unified distribution files (`dist/paystack-enriched.yaml` and `dist/paystack-enriched.json`).

---

### Proof of Concept

This project was created as part of the DevEx Lead technical assessment at Paystack.

It demonstrates the proposed approach, developer experience, and technical thinking behind the solution. The implementation is intentionally open to further refinement and iteration.

---

## 1. Stripe-Quality Spec Enrichment Features

| Extension / Metadata | Purpose & Target Operations | Impact on Downstream SDK Generators |
| :--- | :--- | :--- |
| **`x-idempotency: true`** | Added to resource creation & financial endpoints </br>(`POST /transaction/initialize`, `POST /charge`, `POST /transfer`, `POST /refund`, `POST /customer`, etc.). | SDK generators automatically inject `X-Idempotency-Key` headers and auto-generate UUIDs if missing. |
| **`x-retry-safe: true`** | Added to 97 GET operations and idempotent POST operations. | SDK resilience loop automatically retries transient 5xx, 429, and network errors safely. |
| **`x-dont-retry: true`** | Added to non-idempotent state-mutating actions </br>(`POST`, `PUT`, `DELETE`). | SDK resilience loop suppresses automatic retries to prevent duplicate operations. |
| **`x-pagination`** | Defined on 17 collection list endpoints </br> (`/transaction`, `/customer`, `/transfer`, `/subscription`, `/plan`, `/refund`, `/subaccount`, `/dispute`, `/dedicated_account`, etc.). | Generators emit `.autoPaginate()` async generator iterators. |
| **`x-operation-id`** | Standardized camelCase names with 100% coverage </br>(163/163 HTTP operations mapped). | Determines clean, idiomatic method names across all target SDK languages </br>(Node, Python, Go, Java, PHP). |
| **`x-code-samples`** | Modular code snippets per endpoint (`snippets/<operationId>/[node|python|curl|go|php].*`). | Embedded directly into IDE hover docstrings </br>(JSDoc, PyDoc, GoDoc, PHPDoc). |
| **`x-deprecated-reason`** | Migration guidance notices for deprecated endpoints. | IDEs highlight deprecation warnings with actionable guidance. |
| **`WebhookEvent`** | Polymorphic (`oneOf` + `discriminator`) typed event payload models </br>(`ChargeSuccessEvent`, `TransferSuccessEvent`, `SubscriptionCreateEvent`, etc.). | Downstream SDK users receive strongly-typed webhook event deserialization. |

---

## 2. Directory Structure (`paystack-spec-enriched`)

```
paystack-spec-enriched/
├── .github/
│   └── workflows/
│       └── sync-upstream.yml         # Auto-syncs raw spec from PaystackOSS/openapi & builds
├── spec/
│   └── upstream/
│       └── paystack.yaml             # Raw spec synced from PaystackOSS/openapi
├── snippets/                         # Modular Code Samples per Operation ID
│   ├── initializeTransaction/
│   │   ├── node.ts                   # Node.js sample snippet
│   │   ├── python.py                 # Python sample snippet
│   │   └── curl.sh                   # cURL sample snippet
│   ├── createCustomer/
│   ├── initiateTransfer/
│   └── ...
├── overlays/                         # Custom Spec Extensions & Overrides
│   ├── operation-ids.json            # 100% clean camelCase operationId mapping
│   ├── idempotency.json              # Financial & creation endpoints marked x-idempotency: true
│   ├── pagination.json               # x-pagination metadata for list endpoints
│   ├── deprecations.json             # x-deprecated-reason migration guides
│   └── webhooks.json                 # Polymorphic webhook event payload schemas
├── scripts/
│   ├── sync-upstream.js              # Syncs raw spec & computes SHA256 diff
│   └── build-enriched-spec.js        # Merges base spec + overlays + snippets + sanitizer
├── dist/                             # Compiled Enriched Spec Artifacts
│   ├── paystack-enriched.yaml        # Validated YAML Spec (0 Redocly errors & 0 warnings)
│   └── paystack-enriched.json        # Validated JSON Spec
├── .redocly.yaml                     # Redocly CLI linter rules configuration
├── package.json
└── README.md
```

---

## 3. NPM Scripts & Commands

- `npm run sync` : Fetches raw spec from `PaystackOSS/openapi/dist/paystack.yaml`.
- `npm run build`: Applies overlays, snippets, retry hints, pagination metadata, and schema sanitizer $\rightarrow$ `dist/paystack-enriched.yaml`.
- `npm run lint` : Runs `redocly lint dist/paystack-enriched.yaml` (0 errors, 0 warnings).

---

## 4. Ecosystem Tooling Integration Guide

For detailed technical guidelines on how downstream tools consume this enriched spec:
- Refer to [INTEGRATION.md](file:///home/alex-muturi/alex/alex-paystack/paystack-spec-enriched/INTEGRATION.md) for full integration architecture covering `paystack-sdk-gen`, `paystack-cli`, and `paystack-docs`.

---

## License & Assessment Notice

This project was created as part of the DevEx Lead technical assessment at Paystack. It is a proof of concept provided for evaluation purposes.

See [LICENSE](LICENSE) for the assessment terms.


