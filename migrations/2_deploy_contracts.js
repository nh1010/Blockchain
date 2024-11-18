const ResearcherDID = artifacts.require("ResearcherDID");
const CitationReward = artifacts.require("CitationReward");

module.exports = async function (deployer) {
  // Deploy the ResearcherDID contract
  await deployer.deploy(ResearcherDID);
  const researcherDID = await ResearcherDID.deployed();
  console.log("ResearcherDID deployed at:", researcherDID.address);

  // Deploy the CitationReward contract
  await deployer.deploy(CitationReward);
  const citationReward = await CitationReward.deployed();
  console.log("CitationReward deployed at:", citationReward.address);
};
