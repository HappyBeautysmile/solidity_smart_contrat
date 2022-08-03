import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("004.Variables", () => {
  let variables: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const Variables = await ethers.getContractFactory("Variables");
    variables = await Variables.deploy();
    await variables.deployed();
  });

  describe("Variables", async () => {
    it(`Verification : State variables`, async () => {
      const text = await variables.text();
      expect(text).to.equal("Hello");

      const num = await variables.num();
      expect(num).to.equal(123);
    });

    it(`Verification : Local variables, Global variables`, async () => {
      const [i, timestamp, sender] = await variables.doSomething();

      expect(i).to.equal(456);
      expect(timestamp).to.lessThan(Date.now());
      expect(sender).to.equal(deployer.address);
    });
  });
});
