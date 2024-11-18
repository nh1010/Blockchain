module.exports = {
  // Configure networks, compilers, etc.

  contracts_build_directory: "./src/build/contracts", // This sets the output directory for contract artifacts

  networks: {
    development: {
      host: "127.0.0.1", // Ganache or other local Ethereum nodes
      port: 8545,
      network_id: "*", // Match any network ID
    },
  },

  compilers: {
    solc: {
      version: "0.8.0", // Ensure this matches the version of your contract
    },
  },
};
