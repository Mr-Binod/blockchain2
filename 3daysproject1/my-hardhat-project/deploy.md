# Contract Deployment Guide using Hardhat Ignition

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

## Contract Overview

### 1. BingNFT (ERC1155)
- NFT marketplace contract
- No constructor parameters needed
- Handles NFT minting, buying, selling

### 2. Bingtoken (ERC20)
- ERC20 token contract
- Constructor parameters: `name`, `symbol`
- Default: "Bing Token", "BING"

### 3. MetaTransaction
- Meta-transaction handler for Bingtoken
- Depends on Bingtoken contract
- Handles batch minting with signatures

### 4. MetaBingNFT (NEW)
- Meta-transaction handler for BingNFT
- Depends on BingNFT contract
- Allows users to mint NFTs without paying gas fees directly

## Deployment Commands

### 1. Deploy Individual Contracts

#### Deploy BingNFT only:
```bash
npx hardhat ignition deploy ignition/modules/BingNFT.js --network sepolia
```

#### Deploy Bingtoken only:
```bash
npx hardhat ignition deploy ignition/modules/Bingtoken.js --network sepolia
```

#### Deploy MetaTransaction (includes Bingtoken):
```bash
npx hardhat ignition deploy ignition/modules/MetaTransaction.js --network sepolia
```

#### Deploy MetaBingNFT (NEW):
```bash
npx hardhat ignition deploy ignition/modules/MetaBingNFT.js --network sepolia
```

#### Deploy MetaBingNFT with existing BingNFT:
```bash
npx hardhat ignition deploy ignition/modules/MetaBingNFTWithExisting.js --network sepolia
```

### 2. Deploy All Contracts Together
```bash
npx hardhat ignition deploy ignition/modules/DeployAll.js --network sepolia
```

### 3. Deploy with Custom Parameters
```bash
npx hardhat ignition deploy ignition/modules/ConfigurableDeploy.js \
  --parameters tokenName="My Custom Token" \
  --parameters tokenSymbol="MCT" \
  --network sepolia
```

### 4. Deploy to Local Network (Testing)
```bash
npx hardhat ignition deploy ignition/modules/DeployAll.js
```

## Module Structure

### BingNFT.js
```javascript
const bingNFT = m.contract("BingNFT");
```

### Bingtoken.js
```javascript
const bingtoken = m.contract("Bingtoken", [
  "Bing Token",  // name
  "BING"         // symbol
]);
```

### MetaTransaction.js
```javascript
const bingtoken = m.contract("Bingtoken", ["Bing Token", "BING"]);
const metaTransaction = m.contract("MetaTransaction", [bingtoken]);
```

### MetaBingNFT.js (NEW)
```javascript
const bingNFT = m.contract("BingNFT");
const metaBingNFT = m.contract("MetaBingNFT", [bingNFT]);
```

### MetaBingNFTWithExisting.js (NEW)
```javascript
const BINGNFT_ADDRESS = "0xA51224dd0Fe0051d49a6ADbEA1487cF0D13f72C7";
const metaBingNFT = m.contract("MetaBingNFT", [BINGNFT_ADDRESS]);
```

### DeployAll.js
- Deploys all contracts in correct order
- Handles dependencies automatically
- Returns all contract instances

## Deployment Output

After successful deployment, you'll see:
```
✅ DeployAllModule deployed
Contract: BingNFT at 0x...
Contract: Bingtoken at 0x...
Contract: MetaTransaction at 0x...
Contract: MetaBingNFT at 0x...
Gas used: XXX
```

## Contract Addresses

After deployment, save these addresses:
- **BingNFT**: `0x...` (NFT marketplace)
- **Bingtoken**: `0x...` (ERC20 token)
- **MetaTransaction**: `0x...` (Meta-transaction handler for tokens)
- **MetaBingNFT**: `0x...` (Meta-transaction handler for NFTs)

## Using Deployed Contracts

### 1. Update Frontend Configuration
```javascript
// In your frontend (NFT.jsx, etc.)
const BINGNFT_ADDRESS = "0x..."; // Deployed BingNFT address
const BINGTOKEN_ADDRESS = "0x..."; // Deployed Bingtoken address
const METATRANSACTION_ADDRESS = "0x..."; // Deployed MetaTransaction address
const METABINGNFT_ADDRESS = "0x..."; // Deployed MetaBingNFT address
```

### 2. Test Contract Functions

#### Test BingNFT (Direct)
```javascript
const bingNFT = new ethers.Contract(BINGNFT_ADDRESS, BINGNFT_ABI, signer);
await bingNFT.mint(userAddress, tokenId, amount, data);
```

#### Test BingNFT (Meta-transaction)
```javascript
const metaBingNFT = new ethers.Contract(METABINGNFT_ADDRESS, META_BINGNFT_ABI, signer);
await metaBingNFT.mintNFT(userAddress, tokenId, amount, metadata, signature);
```

#### Test Bingtoken
```javascript
const bingtoken = new ethers.Contract(BINGTOKEN_ADDRESS, BINGTOKEN_ABI, signer);
await bingtoken.mint(userAddress, ethers.parseEther("1000"));
```

#### Test MetaTransaction
```javascript
const metaTransaction = new ethers.Contract(METATRANSACTION_ADDRESS, METATRANSACTION_ABI, signer);
// Use for batch minting with signatures
```

### 3. Meta-transaction Flow

#### For NFTs:
1. User signs metadata message
2. Call `mintNFT` on MetaBingNFT contract
3. Contract verifies signature
4. NFT is minted to user without them paying gas

#### For Tokens:
1. User signs message
2. Call `mint` on MetaTransaction contract
3. Contract verifies signature
4. Tokens are minted to user without them paying gas

## Verification

Verify all contracts on Etherscan:
```bash
npx hardhat verify --network sepolia BINGNFT_ADDRESS
npx hardhat verify --network sepolia BINGTOKEN_ADDRESS "Bing Token" "BING"
npx hardhat verify --network sepolia METATRANSACTION_ADDRESS BINGTOKEN_ADDRESS
npx hardhat verify --network sepolia METABINGNFT_ADDRESS BINGNFT_ADDRESS
```

## Troubleshooting

### Common Issues:

1. **"Invalid JSON-RPC response"**
   - Check your `.env` file and Infura project ID
   - Ensure you have sufficient Sepolia ETH

2. **"Contract verification failed"**
   - Wait a few minutes after deployment before verifying
   - Check constructor arguments match exactly

3. **"Gas estimation failed"**
   - Ensure you have enough Sepolia ETH for gas
   - Check contract dependencies are deployed

4. **"Signature verification failed"**
   - Ensure the signer matches the user address
   - Check the message format matches exactly

### Meta-transaction Specific Issues:

1. **"Invalid signature"**
   - Ensure the user signed the exact metadata string
   - Check the signature format (65 bytes)

2. **"User not authorized"**
   - Ensure the user address matches the signature
   - Check the metadata format

## Benefits of Meta-transactions

### For Users:
- ✅ No need to hold ETH for gas fees
- ✅ Can pay fees with project tokens (BTK)
- ✅ Better user experience
- ✅ Lower barrier to entry

### For Developers:
- ✅ Increased user adoption
- ✅ Reduced friction
- ✅ Better token utility
- ✅ Scalable solution 