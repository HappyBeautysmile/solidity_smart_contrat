import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract, utils } from "ethers";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "../../helpers/constant";
import { converter } from "../../helpers/unit-converter";

describe("001.Ballot", () => {
  const proposals = ["For", "Against", "Abstain"];
  const bytesProposals = proposals.map((proposal) =>
    utils.formatBytes32String(proposal)
  );

  let ballot: Contract;

  let owner: SignerWithAddress,
    notOwner: SignerWithAddress,
    two: SignerWithAddress,
    three: SignerWithAddress,
    four: SignerWithAddress,
    five: SignerWithAddress,
    six: SignerWithAddress,
    seven: SignerWithAddress,
    voters: SignerWithAddress[];

  before(async () => {
    [owner, notOwner, two, three, four, five, six, seven] =
      await ethers.getSigners();
    voters = [two, three, four, five, six, seven];

    const Ballot = await ethers.getContractFactory("Ballot");
    ballot = await Ballot.deploy(bytesProposals);
    await ballot.deployed();
  });

  describe("Ballot", async () => {
    describe("Constructor : Validation", async () => {
      it("chairperson", async () => {
        const chairperson = await ballot.chairperson();
        expect(chairperson).to.equal(owner.address);
      });

      it("voter : chairperson", async () => {
        const { weight, voted, delegate, vote } = await ballot.voters(
          owner.address
        );
        expect(weight).to.equal(1);
        expect(voted).to.equal(false);
        expect(delegate).to.equal(ZERO_ADDRESS);
        expect(vote).to.equal(0);
      });

      it("proposals", async () => {
        const proposalsLength = await ballot.getProposalsLength();
        expect(proposalsLength).to.equal(3);

        for (let i = 0; i < proposalsLength; i++) {
          const { name: bytesName, voteCount } = await ballot.proposals(i);
          const stringifyName = utils.parseBytes32String(bytesName);
          expect(stringifyName).to.equal(proposals[i]);
          expect(voteCount).to.equal(0);
        }
      });
    });

    describe("Function : giveRightToVote", async () => {
      it("Success : two, three, four, five", async () => {
        for (let i = 0; i < voters.length; i++) {
          const { weight: preWeight } = await ballot.voters(voters[i].address);
          expect(preWeight).to.equal(0);

          const giveRightToVoteTx = await ballot.giveRightToVote(
            voters[i].address
          );
          await giveRightToVoteTx.wait();

          const { weight: curWeight } = await ballot.voters(voters[i].address);
          expect(curWeight).to.equal(1);
        }
      });

      it("Failed : Only chairperson can give right to vote", async () => {
        for (let i = 0; i < voters.length; i++) {
          const giveRightToVoteTx = ballot
            .connect(notOwner)
            .giveRightToVote(voters[i].address);

          await expect(giveRightToVoteTx).to.revertedWith(
            "Only chairperson can give right to vote."
          );
        }
      });

      it("Failed : The voter already voted.", async () => {
        for (let i = 0; i < voters.length; i++) {
          const giveRightToVoteTx = ballot.giveRightToVote(voters[i].address);

          await expect(giveRightToVoteTx).to.revertedWith(
            "Already became voter."
          );
        }
      });

      it("Vote : Success : two : to `Abstain`", async () => {
        const voteTx = await ballot.connect(two).vote(2);
        await voteTx.wait();

        const { weight, voted, delegate, vote } = await ballot.voters(
          two.address
        );
        expect(weight).to.equal(1);
        expect(voted).to.equal(true);
        expect(delegate).to.equal(ZERO_ADDRESS);
        expect(vote).to.equal(2);
      });

      it("Failed : The voter already voted", async () => {
        const giveRightToVoteTx = ballot.giveRightToVote(two.address);

        await expect(giveRightToVoteTx).to.revertedWith(
          "The voter already voted."
        );
      });
    });

    describe("Function : delegate", async () => {
      it("Success : delegate from three to four : three doesn't vote yet", async () => {
        const delegateTx = await ballot.connect(three).delegate(four.address);
        await delegateTx.wait();

        const {
          weight: weight3,
          voted: voted3,
          delegate: delegate3,
          vote: vote3,
        } = await ballot.voters(three.address);
        expect(weight3).to.equal(1);
        expect(voted3).to.equal(true);
        expect(delegate3).to.equal(four.address);
        expect(vote3).to.equal(0); // not vote yet

        const {
          weight: weight4,
          voted: voted4,
          delegate: delegate4,
          vote: vote4,
        } = await ballot.voters(four.address);
        expect(weight4).to.equal(2);
        expect(voted4).to.equal(false);
        expect(delegate4).to.equal(ZERO_ADDRESS);
        expect(vote4).to.equal(0); // not vote yet
      });

      it("Success : delegate from five to two : two already voted to `Abstain`", async () => {
        const { voteCount: preVoteCount } = await ballot.proposals(2); // `Abstain`
        expect(preVoteCount).to.equal(1);

        const delegateTx = await ballot.connect(five).delegate(two.address);
        await delegateTx.wait();

        const {
          weight: weight5,
          voted: voted5,
          delegate: delegate5,
          vote: vote5,
        } = await ballot.voters(five.address);
        expect(weight5).to.equal(1);
        expect(voted5).to.equal(true);
        expect(delegate5).to.equal(two.address);
        expect(vote5).to.equal(0); // there is no vote, but default is 0

        const {
          weight: weight2,
          voted: voted2,
          delegate: delegate2,
          vote: vote2,
        } = await ballot.voters(two.address);
        expect(weight2).to.equal(1);
        expect(voted2).to.equal(true);
        expect(delegate2).to.equal(ZERO_ADDRESS);
        expect(vote2).to.equal(2); // already voted 2

        const { voteCount: curVoteCount } = await ballot.proposals(2); // `Abstain`
        expect(curVoteCount).to.equal(2); // voteCount increase
      });

      it("Failed : You have no right to vote.", async () => {
        const delegateTx = ballot.connect(notOwner).delegate(two.address);

        await expect(delegateTx).to.revertedWith("You have no right to vote.");
      });

      it("Failed : You already voted.", async () => {
        const delegateTx = ballot.connect(two).delegate(three.address);

        await expect(delegateTx).to.revertedWith("You already voted.");
      });

      it("Failed : Self-delegation is disallowed.", async () => {
        const delegateTx = ballot.connect(owner).delegate(owner.address);

        await expect(delegateTx).to.revertedWith(
          "Self-delegation is disallowed."
        );
      });

      it("Failed : Found loop in delegation.", async () => {
        const delegateTx = ballot.connect(four).delegate(three.address);

        await expect(delegateTx).to.revertedWith("Found loop in delegation.");
      });

      it("Failed : Can't delegate to not voter.", async () => {
        const delegateTx = ballot.connect(four).delegate(notOwner.address);

        await expect(delegateTx).to.revertedWith(
          "Can't delegate to not voter."
        );
      });
    });
    describe("vote : and check result", async () => {
      it("vote has to completed", async () => {});

      it("Validation : winningProposal : For 0 , Against 0, Abstain 2", async () => {
        const winningProposal = await ballot.winningProposal();
        expect(winningProposal).to.equal(2);
      });

      it("Validation : winnerName", async () => {
        const winnerName = await ballot.winnerName();
        expect(winnerName).to.equal(bytesProposals[2]);
      });
    });
  });
});
