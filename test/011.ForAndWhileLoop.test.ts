import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("011.ForAndWhileLoop", () => {
  let loop: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const Loop = await ethers.getContractFactory("Loop");
    loop = await Loop.deploy();
    await loop.deployed();
  });

  describe("Loop", async () => {
    it(`Function : loop : Success`, async () => {
      const loopResult = await loop.loop();
      expect(loopResult).to.equal(5);
    });

    it(`Function : whileLoop : Success`, async () => {
      const whileLoop = await loop.whileLoop();
      expect(whileLoop).to.equal(10);
    });
  });
});
