import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("117.HashingWithKeccak256", () => {
  let hashFunction: Contract, guessTheMagicWord: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const HashFunction = await ethers.getContractFactory("HashFunction");
    hashFunction = await HashFunction.deploy();
    await hashFunction.deployed();

    const GuessTheMagicWord = await ethers.getContractFactory(
      "GuessTheMagicWord"
    );
    guessTheMagicWord = await GuessTheMagicWord.deploy();
    await guessTheMagicWord.deployed();
  });

  describe("HashFunction", async () => {
    it(`Function : encode : Success : If you are dealing with more than one dynamic data type as it prevents collision.`, async () => {
      const encode1 = await hashFunction.encode("AAA", "BBB");
      const encode2 = await hashFunction.encode("AA", "ABBB");
      expect(encode1).to.not.equal(encode2);
    });

    it(`Function : encodePacked : Success : Takes all types of data and any amount of input.
    `, async () => {
      const encodePacked1 = await hashFunction.encodePacked("AAA", "BBB");
      const encodePacked2 = await hashFunction.encodePacked("AA", "ABBB");
      expect(encodePacked1).to.equal(encodePacked2);
    });
  });

  describe("GuessTheMagicWord", async () => {
    it(`Function : guess : Success : true`, async () => {
      const guess1 = await guessTheMagicWord.guess("Solidity");
      expect(guess1).to.equal(true);
    });

    it(`Function : guess : Failed : false : invalid word`, async () => {
      const guess1 = await guessTheMagicWord.guess("Solidity1");
      expect(guess1).to.equal(false);
    });
  });
});
