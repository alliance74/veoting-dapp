const { expect } = require("chai");
const { ethers }  = require("hardhat");

// ── helpers ────────────────────────────────────────────────────────────────
// ethers v5 returns BigNumber; convert to JS number for simple comparisons
const n = (bn) => bn.toNumber();

// ethers v5 revert check: just check the tx throws
async function expectRevert(promise) {
  try {
    await promise;
    throw new Error("Expected transaction to revert but it did not");
  } catch (err) {
    if (err.message === "Expected transaction to revert but it did not") throw err;
    // any other error = reverted as expected
  }
}

describe("Voting", function () {
  let voting, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.deployed();
  });

  // ── createPoll ─────────────────────────────────────────────────────────────

  describe("createPoll", function () {
    it("creates a poll and emits PollCreated", async function () {
      const tx = await voting.createPoll("Best chain?", ["Ethereum", "Solana"], 60);
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "PollCreated");
      expect(event).to.not.be.undefined;
      expect(event.args.question).to.equal("Best chain?");
      expect(n(await voting.getTotalPolls())).to.equal(1);
    });

    it("increments pollCount for multiple polls", async function () {
      await (await voting.createPoll("Q1", ["A", "B"], 10)).wait();
      await (await voting.createPoll("Q2", ["X", "Y", "Z"], 30)).wait();
      expect(n(await voting.getTotalPolls())).to.equal(2);
    });

    it("reverts on empty question", async function () {
      await expectRevert(voting.createPoll("", ["A", "B"], 60));
    });

    it("reverts on only one option", async function () {
      await expectRevert(voting.createPoll("Q?", ["Only"], 60));
    });

    it("reverts on zero duration", async function () {
      await expectRevert(voting.createPoll("Q?", ["A", "B"], 0));
    });
  });

  // ── vote ───────────────────────────────────────────────────────────────────

  describe("vote", function () {
    beforeEach(async function () {
      await (await voting.createPoll("Best chain?", ["Ethereum", "Solana", "BNB"], 60)).wait();
    });

    it("records a vote and emits Voted", async function () {
      const tx = await voting.connect(addr1).vote(0, 1);
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "Voted");
      expect(event).to.not.be.undefined;
      expect(n(event.args.optionIndex)).to.equal(1);

      const [, , , , votes] = await voting.getPoll(0);
      expect(n(votes[1])).to.equal(1);
    });

    it("prevents double voting", async function () {
      await (await voting.connect(addr1).vote(0, 0)).wait();
      await expectRevert(voting.connect(addr1).vote(0, 1));
    });

    it("reverts on invalid option index", async function () {
      await expectRevert(voting.connect(addr1).vote(0, 99));
    });

    it("reverts on non-existent poll", async function () {
      await expectRevert(voting.connect(addr1).vote(99, 0));
    });

    it("multiple users can vote independently", async function () {
      await (await voting.connect(addr1).vote(0, 0)).wait();
      await (await voting.connect(addr2).vote(0, 2)).wait();
      await (await voting.connect(owner).vote(0, 0)).wait();

      const [, , , , votes] = await voting.getPoll(0);
      expect(n(votes[0])).to.equal(2);
      expect(n(votes[2])).to.equal(1);
    });
  });

  // ── getPoll ────────────────────────────────────────────────────────────────

  describe("getPoll", function () {
    it("returns correct poll data", async function () {
      await (await voting.createPoll("Favourite color?", ["Red", "Blue"], 120)).wait();
      const [id, creator, question, options, votes, , active] =
        await voting.getPoll(0);

      expect(n(id)).to.equal(0);
      expect(creator).to.equal(owner.address);
      expect(question).to.equal("Favourite color?");
      expect(options).to.deep.equal(["Red", "Blue"]);
      expect(n(votes[0])).to.equal(0);
      expect(n(votes[1])).to.equal(0);
      expect(active).to.be.true;
    });

    it("reverts for non-existent poll", async function () {
      await expectRevert(voting.getPoll(42));
    });
  });

  // ── didIVote ───────────────────────────────────────────────────────────────

  describe("didIVote", function () {
    beforeEach(async function () {
      await (await voting.createPoll("Q?", ["A", "B"], 60)).wait();
    });

    it("returns false before voting", async function () {
      expect(await voting.connect(addr1).didIVote(0)).to.be.false;
    });

    it("returns true after voting", async function () {
      await (await voting.connect(addr1).vote(0, 0)).wait();
      expect(await voting.connect(addr1).didIVote(0)).to.be.true;
    });
  });

  // ── getTotalPolls ──────────────────────────────────────────────────────────

  describe("getTotalPolls", function () {
    it("returns 0 initially", async function () {
      expect(n(await voting.getTotalPolls())).to.equal(0);
    });

    it("counts polls correctly after 3 polls", async function () {
      for (let i = 0; i < 3; i++) {
        await (await voting.createPoll(`Poll ${i}`, ["Yes", "No"], 10)).wait();
      }
      expect(n(await voting.getTotalPolls())).to.equal(3);
    });
  });
});

// expectRevert: compatible with ethers v5 without chai-as-promised
