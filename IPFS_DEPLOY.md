# 🌐 How to Host VoteChain on IPFS

This guide walks you through deploying the VoteChain DApp frontend to IPFS using **Pinata** (easiest method) or the local IPFS daemon.

---

## Prerequisites

- Node.js 18+ installed ✅
- MetaMask browser extension installed
- The smart contract already deployed (see README below)

---

## Step 1 — Compile the Smart Contract

```powershell
npm run compile
```

---

## Step 2 — Start a Local Hardhat Node

Open a **new terminal window** and keep it running:

```powershell
npm run node
```

You'll see 20 test accounts with 10 000 ETH each. Copy any private key.

---

## Step 3 — Deploy the Contract

In your **original terminal**:

```powershell
npm run deploy:local
```

This will:
- Deploy `Voting.sol` to your local node
- Save `frontend/contract.json` with the ABI + deployed address

---

## Step 4 — Connect MetaMask to Local Network

1. Open MetaMask → **Add Network** → **Add manually**
2. Fill in:
   - **Network Name**: Hardhat Local
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency**: ETH
3. Import a test account using one of the private keys printed by `npm run node`

---

## Step 5 — Serve the Frontend Locally (Test)

Install a simple static server:

```powershell
npx -y serve frontend
```

Open `http://localhost:3000` — your DApp should be live!

---

## Step 6 — Upload to IPFS via Pinata

### 6a. Create a Free Pinata Account
Go to [https://pinata.cloud](https://pinata.cloud) and sign up.

### 6b. Upload the `frontend/` folder
1. Click **"Add Files"** → **"Folder"**
2. Select your `frontend/` folder (it must contain `index.html`, `style.css`, `app.js`, `contract.json`)
3. Click **"Upload"**
4. You'll get a **CID** (e.g. `QmXyz...`)

### 6c. Access your DApp
Your DApp is now live on IPFS at:

```
https://gateway.pinata.cloud/ipfs/<YOUR_CID>
https://ipfs.io/ipfs/<YOUR_CID>
```

---

## Alternative — Upload via IPFS Desktop

1. Download [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/)
2. Open the app → go to **Files**
3. Click **Import** → **Folder** → select `frontend/`
4. Click the ⋮ menu → **Copy CID**
5. Visit: `https://ipfs.io/ipfs/<CID>`

---

## Deploy to Sepolia Testnet (Public)

For a real public deployment:

1. Get Sepolia ETH from [https://sepoliafaucet.com](https://sepoliafaucet.com)
2. Get an Infura API key from [https://infura.io](https://infura.io)
3. Edit `hardhat.config.js` — uncomment the `sepolia` network and fill in your keys
4. Run:
   ```powershell
   npm run deploy:sepolia
   ```
5. Update `frontend/contract.json` is auto-updated by the script
6. Upload the `frontend/` folder to IPFS

---

## Project Structure

```
dapp/
├── contracts/
│   └── Voting.sol          ← Smart contract
├── scripts/
│   └── deploy.js           ← Deployment script
├── test/
│   └── Voting.test.js      ← Automated tests
├── frontend/
│   ├── index.html          ← DApp UI
│   ├── style.css           ← Premium styling
│   ├── app.js              ← ethers.js logic
│   └── contract.json       ← ABI + address (auto-generated)
├── hardhat.config.js
└── package.json
```

---

## Run Tests

```powershell
npm test
```

Expected output: **14 passing** tests covering createPoll, vote, and getPoll.


> Tip: Use Alchemy free tier for Sepolia RPC endpoint.


> Note: Pin your CID on multiple gateways for redundancy.
