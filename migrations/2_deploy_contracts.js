const ResearcherDID = artifacts.require("ResearcherDID");
const PaperCitationReward = artifacts.require("PaperCitationReward");

module.exports = async function (deployer) {
  // Deploy the ResearcherDID contract
  await deployer.deploy(ResearcherDID);
  const researcherDID = await ResearcherDID.deployed();
  console.log("ResearcherDID deployed at:", researcherDID.address);

   // Deploy the PaperCitationReward contract with ResearcherDID address
   await deployer.deploy(PaperCitationReward, researcherDID.address);
   const paperCitationReward = await PaperCitationReward.deployed();
   console.log("PaperCitationReward deployed at:", paperCitationReward.address);
};
