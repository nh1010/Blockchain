const CitationReward = artifacts.require("CitationReward");
const ResearcherDID = artifacts.require("ResearcherDID");

contract("CitationReward", (accounts) => {
  let citationReward;
  let researcherDID;
  const researcher1 = accounts[0];
  const researcher2 = accounts[1];

  beforeEach(async () => {
    citationReward = await CitationReward.new();
    researcherDID = await ResearcherDID.new();
  });

  it("should register a researcher", async () => {
    const did = "did:example:123";
    await researcherDID.registerResearcher(
      did,
      "John Doe",
      "MIT",
      "Computer Science",
      { from: researcher1 }
    );

    const result = await researcherDID.getResearcher(did);
    assert.equal(result.name, "John Doe");
    assert.equal(result.institution, "MIT");
  });

  it("should add citation and distribute reward", async () => {
    const did = "did:example:456";
    await citationReward.registerResearcher("Jane Doe", did, researcher2, {
      from: researcher1,
    });

    // Fund the contract with some ETH for rewards
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: citationReward.address,
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(researcher2);

    await citationReward.addCitation(did, { from: researcher1 });

    const finalBalance = await web3.eth.getBalance(researcher2);
    assert(finalBalance > initialBalance, "Reward not distributed");
  });

  describe("Citation Management", () => {
    beforeEach(async () => {
      await citationReward.registerResearcher(
        "John Doe",
        "did:example:123",
        researcher1,
        { from: accounts[0] }
      );
    });

    it("should prevent self-citation", async () => {
      try {
        await citationReward.addCitation("did:example:123", {
          from: researcher1,
        });
        assert.fail("Should not allow self-citation");
      } catch (error) {
        assert(error.message.includes("Self-citation not allowed"));
      }
    });

    it("should track citation count", async () => {
      await citationReward.addCitation("did:example:123", {
        from: researcher2,
      });
      const researcher = await citationReward.researchers("did:example:123");
      assert.equal(researcher.citationCount, 1);
    });
  });
});
