# Research Citation DApp

A decentralized application for managing research citations and rewarding researchers using blockchain technology.

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
  - `/contracts`: Contract ABIs and network information

## Features

- Researcher registration with DID
- Citation management
- Automatic reward distribution
- Researcher profile viewing and update
- MetaMask integration

## User Manual
LINK: https://docs.google.com/document/d/1v_fWulRCTvPYJ5P1ezoi98VSOulpCTefN0Z-uT29vbI/edit?usp=sharing
