# Ethos Reputation Gate API

Deno backend for Ethos reputation checking.

## Development

```bash
deno task dev
```

## Endpoints

`POST /api/check-access`

Check if address meets reputation requirements.

Request:

```json
{
  "address": "0x...",
  "signature": "0x...",
  "nonce": "uuid-or-random",
  "issuedAt": "2025-01-01T00:00:00.000Z",
  "minScore": 1400
}
```

Response:

```json
{
  "address": "0x...",
  "score": 1847,
  "tier": "ELITE",
  "hasAccess": true,
  "vouches": 12,
  "reviews": 34
}
```

`POST /api/access-token`

Issue a short-lived access token after signature verification.

`POST /api/verify-token`

Verify an access token.

## Deployment

```bash
deno deploy
```

## License

MIT
