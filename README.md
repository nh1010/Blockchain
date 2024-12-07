# Research Citation DApp
This repository contains two smart contracts(ResearcherDID, PaperCitationReward) designed for managing decentralized researcher identities and incentivizing research contributions through citation-based rewards.

### Interacting with the Contracts
- Use the `ResearcherDID` contract to manage researcher profiles and verification.
- Use the `PaperCitationReward` contract to register papers, distribute rewards, and retrieve data.


## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Ganache for local blockchain development

## Installation

1. Clone the repository:

bash
git clone <repository-url>
cd blockchain

2. Install dependencies:

npm install

3. Install Truffle globally:

npm install -g truffle

## Development Setup

1. Start Ganache:

   - Download and install Ganache from [https://trufflesuite.com/ganache/](https://trufflesuite.com/ganache/)
   - Create a new workspace
   - Keep note of the RPC SERVER address (usually http://127.0.0.1:8545)

2. Configure MetaMask:

   - Add a new network in MetaMask
   - Network Name: Ganache
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

3. Import a Ganache account to MetaMask:
   - Copy the private key of any account from Ganache
   - Import account in MetaMask using the private key

## Smart Contract Deployment

1. Compile the contracts:

truffle compile

2. Deploy to local network:

truffle migrate --reset

## Running the Development Server

1. Start the React development server:

npm start

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

### Smart Contract Tests

Run the smart contract tests:

truffle test

## Project Structure

- `/contracts`: Smart contract source files
- `/migrations`: Truffle migration files
- `/test`: Test files for smart contracts and React components
- `/src`: React application source code
  - `/components`: React components
  - `/build/contracts`: Contract ABIs and network information

## Features Overview

- Researcher registration with DID
- Citation management
- Automatic reward distribution
- Researcher profile viewing and update
- MetaMask integration

---
# Contract Details

## ResearcherDID Contract

The `ResearcherDID` contract provides a decentralized identity (DID) management system for researchers. It ensures unique and secure researcher profiles on the blockchain.

### Key Features and Functionalities

#### 1. Registration
- Researchers can register profiles with the following details:
  - Unique DID
  - Name
  - Institution
  - Field of Study
  - Wallet Address
- Ensures no duplicate DIDs are registered.

#### 2. Verification
- Admins or authorized entities can verify researchers' identities and credentials.
- Verification status is stored as a boolean flag in the researcher’s record.

#### 3. Profile Updates
- Registered and verified researchers can update their profile details, such as:
  - Name
  - Institution
  - Field of Study
- Only the wallet address associated with the researcher can make updates.

#### 4. Data Retrieval
- Public functions allow querying researcher details using the DID.
- Functions are available to retrieve:
  - Wallet address
  - Verification status

#### 5. Access Control
- Modifiers (`onlyRegistered` and `onlyVerified`) ensure only eligible researchers or verified entities can perform sensitive operations.

### Example Use Case
In a decentralized academic network:
- Researchers register with the `ResearcherDID` contract.
- Peer review or citation tracking systems verify their credentials through this contract.
- Researchers update their academic achievements directly on the blockchain, maintaining a transparent and immutable record.

---

## PaperCitationReward Contract

The `PaperCitationReward` contract incentivizes research contributions by managing paper registrations, citations, and reward distribution. It interacts with the `ResearcherDID` contract to verify researchers and retrieve wallet addresses.

### Key Features and Functionalities

#### 1. Paper Registration
- Verified researchers can register papers with:
  - A unique paper ID
  - A list of referenced papers
- Registration requires a fee of **0.1 ETH**.
- Automatically constructs lists of primary and secondary contributors based on references.

#### 2. Reward Distribution
- **70%** of the registration fee is distributed equally among primary contributors.
- **30%** of the registration fee is distributed equally among secondary contributors.
- If no primary contributors are found, the fee is refunded to the sender.
- Rewards are transferred to contributors' wallet addresses using `call`.

#### 3. Cross-Contract Interaction
- Validates researchers' verification status through the `ResearcherDID` contract.
- Retrieves wallet addresses for reward distribution.

#### 4. Data Retrieval
- Functions provide access to:
  - Registered papers' details, including author DID and referenced paper list.
  - Specific paper authors using their paper IDs.

#### 5. Refund Mechanism
- If no primary contributors are identified, the registration fee is refunded to the sender.

### Example Workflow

1. **Researcher Registration**:
   - A researcher registers with the `ResearcherDID` contract, providing their DID and verification details.
   
2. **Paper Registration**:
   - The researcher registers a paper with this contract.
   - References are validated, and contributor lists are constructed.
   
3. **Reward Distribution**:
   - Rewards are distributed to contributors based on their roles (primary or secondary).

4. **Data Retrieval**:
   - Users query registered papers and their details, including author information and referenced papers.

---


## User Manual
LINK: https://docs.google.com/document/d/1v_fWulRCTvPYJ5P1ezoi98VSOulpCTefN0Z-uT29vbI/edit?usp=sharing
