const CitationReward = artifacts.require("CitationReward");

contract("CitationReward", (accounts) => {
  let citationReward;
  const researcher1 = accounts[1];
  const researcher2 = accounts[2];
  const researcher3 = accounts[3];

  beforeEach(async () => {
    citationReward = await CitationReward.new();

    // Fund the contract with ETH for rewards
    const fundAmount = web3.utils.toWei("10", "ether");
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: citationReward.address,
      value: fundAmount,
    });
  });

  it("should add citation and distribute reward", async () => {
    const did = "did:example:456";
    await citationReward.registerResearcher("Jane Doe", did, researcher2, {
      from: accounts[0],
    });

    const initialBalance = await web3.eth.getBalance(researcher2);
    const initialBalanceBN = web3.utils.toBN(initialBalance);

    // Add citation from researcher1
    await citationReward.addCitation(did, { from: researcher1 });

    const finalBalance = await web3.eth.getBalance(researcher2);
    const finalBalanceBN = web3.utils.toBN(finalBalance);
    const rewardAmount = web3.utils.toWei("1", "ether");

    assert(
      finalBalanceBN.sub(initialBalanceBN).toString() === rewardAmount,
      "Reward amount not correctly distributed"
    );

    const researcher = await citationReward.researchers(did);
    assert.equal(
      researcher.citationCount.toString(),
      "1",
      "Citation count not updated correctly"
    );
  });

  it("should prevent self-citation", async () => {
    const did = "did:example:123";
    // First register the researcher
    await citationReward.registerResearcher("John Doe", did, researcher1, {
      from: accounts[0],
    });

    try {
      await citationReward.addCitation(did, { from: researcher1 });
      assert.fail("Should not allow self-citation");
    } catch (error) {
      assert(
        error.message.includes("Self-citation not allowed"),
        `Unexpected error: ${error.message}`
      );
    }
  });

  it("should prevent multiple citations from the same researcher", async () => {
    const did = "did:example:789";
    await citationReward.registerResearcher("Alice Smith", did, researcher1, {
      from: accounts[0],
    });

    // First citation
    await citationReward.addCitation(did, { from: researcher2 });

    try {
      // Second citation from the same researcher
      await citationReward.addCitation(did, { from: researcher2 });
      assert.fail("Should not allow multiple citations from the same address");
    } catch (error) {
      assert(
        error.message.includes(
          "Multiple citations from the same address not allowed"
        ),
        `Unexpected error: ${error.message}`
      );
    }
  });

  it("should track citation count correctly", async () => {
    const did = "did:example:101";
    await citationReward.registerResearcher("Bob Johnson", did, researcher1, {
      from: accounts[0],
    });

    await citationReward.addCitation(did, { from: researcher2 });
    await citationReward.addCitation(did, { from: researcher3 });

    const researcher = await citationReward.researchers(did);
    assert.equal(
      researcher.citationCount.toString(),
      "2",
      "Citation count not updated correctly"
    );
  });
});
