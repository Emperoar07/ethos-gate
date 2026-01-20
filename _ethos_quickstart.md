# Vibe Coding Quickstart

## Ethos API Project Setup Instructions

You are setting up a new project that integrates with the Ethos Network API.

### 1. Environment Setup

Install Deno: `curl -fsSL https://deno.land/install.sh | sh`

Create `deno.json` with tasks for dev, check, and any cron jobs needed.

Deno documentation: <https://docs.deno.com/>

### 2. Project Structure

Create:&#x20;

```
src/ 
  ethos-client.ts # API wrapper functions 
  main.ts         # Entry point 
  .env.example    # Document required env vars 
  deno.json
```

### 3. Ethos API Basics

Base URL: `https://api.ethos.network/api/v2`&#x20;

Required header: `X-Ethos-Client` (identifies your app)

All requests should include headers: `{ "X-Ethos-Client": "your-app-name" }`

Documentation:&#x20;

* <https://developers.ethos.network> - Full API docs&#x20;
* <https://developers.ethos.network/llms.txt> - LLM summary
* <https://developers.ethos.network/llms-full.txt> - LLM detailed reference
* <https://api.ethos.network/docs/openapi.json> - OpenAPI v3 spec

### 4. User Key Formats

When looking up users, these formats work:&#x20;

* `address:0x...` - Ethereum address&#x20;
* `service:x.com:<userId>` - Twitter by ID&#x20;
* `service:x.com:username:<handle>` - Twitter by username&#x20;
* `service:discord:<userId>` - Discord

### 5. Example Endpoints

* GET `https://api.ethos.network/api/v2``/score/address?address=0x...` - Get credibility score&#x20;
* GET `https://api.ethos.network/api/v2``/user/by/address/{address}` - Get user profile

See full endpoint list: `https://developers.ethos.network`

### 6. Authentication

Most read endpoints are public (no auth). For authenticated user actions and login integration: <https://developers.ethos.network/api-documentation/log-in-with-ethos>

### 7. Reference Examples

Study these repos for patterns:&#x20;

* <https://github.com/trust-ethos/ethos-twitter-agent&#x20>;
* <https://github.com/trust-ethos/ethos-spiderchart&#x20>;
* <https://github.com/trust-ethos/log-in-with-ethos&#x20>;
* <https://github.com/trust-ethos/ethos-anonymous-reviews&#x20>;
* <https://github.com/trust-ethos/zora-ethos-sniper&#x20>;
* <https://github.com/trust-ethos/ethosUSD-tempo>
