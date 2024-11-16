module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        ),
      network_id: 5,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
