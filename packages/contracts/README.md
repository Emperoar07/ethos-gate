# Ethos Reputation Payments - Smart Contracts

Solidity contracts for reputation-gated payments on Base.

## Contracts

### ReputationPayments.sol

Simple escrow contract for:
- Staking (e.g., stake-to-apply for gigs)
- Payment escrow (hold funds until completion)
- Slashing (for disputes/bad behavior)

## Quick Start

### Install Dependencies

```bash
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

### Deploy to Base Sepolia

Create `.env` file:

```
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_api_key
TREASURY_ADDRESS=your_treasury_address
```

Get Base Sepolia ETH from faucet:
https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

Deploy:

```bash
npm run deploy:sepolia
```

## Contract Addresses

Base Sepolia (Testnet)
- ReputationPayments: [Will be filled after deployment]
- USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e

## Key Functions

Staking

```solidity
function stake(uint256 amount) external
function withdrawStake() external
function slashStake(address user) external
```

Payments

```solidity
function createPayment(address recipient, uint256 amount) external returns (uint256)
function completePayment(uint256 paymentId) external
function refundPayment(uint256 paymentId) external
function slashPayment(uint256 paymentId) external
```

## Security

- ReentrancyGuard on all state-changing functions
- Ownable for admin functions
- OpenZeppelin contracts
- Not audited - testnet only

## License

MIT
