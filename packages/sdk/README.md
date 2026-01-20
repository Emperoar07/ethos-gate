# @ethos/reputation-gate

React SDK for gating access and payments by Ethos reputation score.

## Installation

```bash
npm install @ethos/reputation-gate
```

## Quick Start

```tsx
import { EthosGate, PayButton } from '@ethos/reputation-gate'

function App() {
  return (
    <EthosGate minScore={1400}>
      <PayButton amount={50} token="USDC" />
    </EthosGate>
  )
}
```

## Documentation

Full documentation: https://ethosgate.xyz/docs

## Components

- `<EthosGate />` - Gate content by reputation
- `<PayButton />` - USDC/ETH payments on Base
- `<TrustBadge />` - Display reputation tier

## Hooks

- `useEthosScore(address)` - Fetch reputation data
- `usePayment()` - Handle payments
- `useTrustTier(address)` - Get tier information

## License

MIT
