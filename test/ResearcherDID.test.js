const ResearcherDID = artifacts.require("ResearcherDID");
const assert = require("assert");

contract("ResearcherDID", (accounts) => {
  let researcherDID;

  beforeEach(async () => {
    // Deploy a new instance of the ResearcherDID contract before each test
    researcherDID = await ResearcherDID.new();
  });

  it("should register a new researcher", async () => {
    const did = "did:example:123";
    await researcherDID.registerResearcher(
      did,
      "John Doe",
      "MIT",
      "Computer Science",
      { from: accounts[0] }
    );

    const researcher = await researcherDID.getResearcher(did);

    assert.strictEqual(researcher[0], "John Doe", "Name should match");
    assert.strictEqual(researcher[1], "MIT", "Institution should match");
    assert.strictEqual(
      researcher[2],
      "Computer Science",
      "Field of study should match"
    );
    assert.strictEqual(
      researcher[3],
      accounts[0],
      "Wallet address should match"
    );
  });

  it("should prevent duplicate registration", async () => {
    const did = "did:example:123";

    await researcherDID.registerResearcher(
      did,
      "John Doe",
      "MIT",
      "Computer Science",
      { from: accounts[0] }
    );

    try {
      await researcherDID.registerResearcher(
        did,
        "Jane Doe",
        "Harvard",
        "Physics",
        { from: accounts[1] }
      );
      assert.fail("Duplicate registration not prevented");
    } catch (error) {
      assert.ok(
        error.message.includes("Researcher already registered"),
        "Error message mismatch"
      );
    }
  });
});
