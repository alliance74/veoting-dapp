# VoteChain — Decentralized Voting DApp

A blockchain-based voting application built with **Solidity**, **Hardhat**, and **ethers.js v6**. Fully deployable to IPFS.

## Features

- 🗳️ Create on-chain polls with 2–10 options and a time limit
- ✅ One vote per address per poll (enforced by the smart contract)
- 📊 Real-time vote count bars on every poll card
- 🦊 MetaMask wallet integration
- 🌐 100% static frontend — hostable on IPFS
- 🎨 Premium dark glassmorphism UI

## Quick Start

### 1. Install dependencies
```powershell
npm install
```

### 2. Compile the contract
```powershell
npm run compile
```

### 3. Run tests
```powershell
npm test
```

### 4. Start local blockchain
```powershell
npm run node
```

### 5. Deploy to local network (in a new terminal)
```powershell
npm run deploy:local
```

### 6. Serve the frontend
```powershell
npx serve frontend
```

Open `http://localhost:3000` and connect MetaMask to `localhost:8545` (Chain ID: 1337).

---

## IPFS Deployment

See [IPFS_DEPLOY.md](./IPFS_DEPLOY.md) for full instructions on hosting this DApp on IPFS via Pinata.

## Project Structure

```
dapp/
├── contracts/Voting.sol        ← Smart contract (Solidity 0.8.20)
├── scripts/deploy.js           ← Hardhat deploy script
├── test/Voting.test.js         ← Mocha/Chai tests
├── frontend/
│   ├── index.html              ← Main DApp page
│   ├── style.css               ← Dark glassmorphism styles
│   ├── app.js                  ← ethers.js v6 wallet + contract logic
│   └── contract.json           ← Auto-generated: ABI + address
├── hardhat.config.js
├── IPFS_DEPLOY.md
└── package.json
```

## Smart Contract API

| Function | Description |
|---|---|
| `createPoll(question, options[], durationMin)` | Create a new poll |
| `vote(pollId, optionIndex)` | Cast your vote |
| `getPoll(pollId)` | Read poll details + vote counts |
| `didIVote(pollId)` | Check if caller already voted |
| `getTotalPolls()` | Get total number of polls |

## Tech Stack

- Solidity 0.8.20
- Hardhat 2.x
- ethers.js v6
- Vanilla HTML/CSS/JS
- IPFS / Pinata


## Architecture
Solidity -> Hardhat -> ethers.js -> MetaMask


## MetaMask Setup
Add network: RPC http://127.0.0.1:8545, ChainID 1337


## Scripts
- compile, test, node, deploy:local, deploy:sepolia


## Local Deployment
Default address: 0x5FbDB2315678afecb367f032d93F642f64180aa3


## Frontend Stack
ethers.js v6 (CDN) for browser, ethers v5 for Hardhat tests


## Glossary
DApp=Decentralized App, ABI=Application Binary Interface, IPFS=InterPlanetary File System


## Security
One vote per address per poll is enforced at the smart contract level.


## Poll Duration Examples
1 hour=60min, 1 day=1440min, 1 week=10080min


## Events
- PollCreated(pollId, creator, question, deadline)
- Voted(pollId, voter, optionIndex)


## Custom Errors
PollNotFound | PollExpired | AlreadyVoted | InvalidOption | InvalidInput
