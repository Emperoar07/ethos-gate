# 🔐 Ethos Reputation Gate

**Gate access AND payments by onchain reputation**

[![Demo](https://img.shields.io/badge/demo-live-success)](https://ethosgate.xyz)
[![npm](https://img.shields.io/npm/v/@ethos/reputation-gate)](https://www.npmjs.com/package/@ethos/reputation-gate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Ethos Reputation Gate is a React SDK that enables any app to gate features and payments based on Ethos credibility scores. Built for Base, powered by Ethos Network.

![Hero Image](https://via.placeholder.com/1200x400/1e3a8a/ffffff?text=Ethos+Reputation+Gate)

---

## Demo Use Cases

| Demo | Description | Min Score | Payment |
| --- | --- | --- | --- |
| Event Access | Reputation-gated ticket sales | 1400 | $25 USDC |
| Stake to Apply | Anti-sybil freelance hiring | 1200 | $10 stake |
| Subscriptions | Tiered pricing (80% discount for ELITE) | 700 | $10-50/mo |
| NFT Allowlist | Dynamic mint pricing by tier | 700 | 0.01-0.15 ETH |
| Microtasks | Spam-free task posting | 1600 | $5 fee |
| P2P Lending | Reputation-backed crypto loans | 1200+ | ETH or USDC collateral |
| DeFi Vault | Reputation-based yield vault | 1200+ | USDC or ETH deposit |
| Beta Access | Credibility-gated product access | 1000+ | None |

---

## 📚 Documentation

### `<EthosGate />`

Gate content based on Ethos score.

```tsx
<EthosGate 
  minScore={1400}
  minVouches={3}
  minReviews={5}
  fallback={<AccessDenied />}
>
  <ProtectedContent />
</EthosGate>
```

Props:
- `minScore` (number) - Minimum Ethos score required
- `minVouches` (number) - Minimum vouches required
- `minReviews` (number) - Minimum reviews required
- `children` (ReactNode) - Content shown when access granted
- `fallback` (ReactNode) - Content shown when access denied

### `<PayButton />`

Payment button with USDC/ETH support on Base.

```tsx
<PayButton
  amount={50}
  token="USDC"
  label="Pay Now"
  onSuccess={() => console.log('Payment successful!')}
  onError={(error) => console.error(error)}
/>
```

Props:
- `amount` (number) - Payment amount required
- `token` ("USDC" | "ETH") - Token to use (default: "USDC")
- `label` (string) - Button text
- `onSuccess` (function) - Callback after successful payment
- `onError` (function) - Callback on payment error

### `<TrustBadge />`

Display user's trust tier badge.

```tsx
<TrustBadge score={1847} showScore size="lg" />
```

---

## Hooks

### `useEthosScore(address)`

```tsx
const { score, vouches, reviews, tier, loading } = useEthosScore(address)
```

### `usePayment()`

```tsx
const { pay, isPaying, hash } = usePayment()

await pay({
  amount: 50,
  token: 'USDC',
  onSuccess: () => console.log('Done!')
})
```

### `useTrustTier(address)`

```tsx
const { name, emoji, color, minScore } = useTrustTier(address)
```

---

## 🎨 Trust Tiers

| Tier | Score Range | Emoji | Color | Description |
| --- | --- | --- | --- | --- |
| ELITE | 1600+ | 🌟 | Gold | Top 5% of Ethos users |
| TRUSTED | 1200-1599 | ✅ | Blue | Established community member |
| EMERGING | 700-1199 | 🌱 | Green | Growing reputation |
| NEW | 0-699 | ⚠️ | Gray | New to Ethos |

---

## 💡 Examples

### Tiered Pricing

```tsx
const { tier } = useTrustTier(address)

const price = {
  ELITE: 10,
  TRUSTED: 25,
  EMERGING: 40,
  NEW: 50
}[tier.name]

<PayButton amount={price} token="USDC" />
```

### Multiple Requirements

```tsx
<EthosGate 
  minScore={1400}
  minVouches={3}
  minReviews={5}
>
  <PremiumContent />
</EthosGate>
```

### Custom Fallback

```tsx
<EthosGate 
  minScore={1600}
  fallback={
    <div>
      <h3>Access Denied</h3>
      <p>Need ELITE tier (1600+ score)</p>
      <a href="https://ethos.network">Build Reputation →</a>
    </div>
  }
>
  <EliteFeature />
</EthosGate>
```

---

## 🏗️ Architecture

```
ethos-reputation-gate/
├── packages/
│   ├── sdk/          # React components & hooks
│   ├── api/          # Deno backend (Ethos API wrapper)
│   ├── contracts/    # Solidity smart contracts
│   └── demo/         # Demo website
```

---

## 🚀 Development

Prerequisites:
- Node.js 18+
- pnpm 8+
- Deno 1.40+ (for API)

Setup:

```bash
git clone https://github.com/ethos/reputation-gate
cd ethos-reputation-gate
pnpm install
```

Environment (API CORS):

```bash
# Comma-separated list of allowed origins for CORS
ALLOWED_ORIGINS=https://your-demo.vercel.app,https://your-domain.com
```

Run Locally:

```bash
# Terminal 1: API
cd packages/api
deno task dev

# Terminal 2: Demo site
cd packages/demo
pnpm dev
```

Build SDK:

```bash
cd packages/sdk
pnpm build
```

Deploy Contracts:

```bash
cd packages/contracts
npm run deploy:sepolia
```

---

## 📦 Packages

- `@ethos/reputation-gate` - React SDK
- `api` - Deno backend
- `contracts` - Solidity contracts
- `demo` - Demo website

---

## 🔗 Links

- Live Demo: https://ethosgate.xyz
- Documentation: https://ethosgate.xyz/docs
- Ethos Network: https://ethos.network
- Ethos API Docs: https://developers.ethos.network
- Base: https://base.org

---

## 🤝 Contributing

Contributions welcome! See CONTRIBUTING.md

---

## 📄 License

MIT License - see LICENSE

---

## 🙏 Built With

- Ethos Network - Onchain reputation
- Base - L2 blockchain
- Wagmi - React hooks for Ethereum
- RainbowKit - Wallet connection
- Vite - Build tool
- Tailwind CSS - Styling

---

## 🏆 Hackathon

- Built for: Ethos Vibeathon 2026
- Category: Net New Product
- Team: [emperoar007(0XB)]
- Demo Video: [YouTube Link]

---

⭐ If you find this useful, please star the repo!

Made with ❤️ for the Ethos & Base communities
