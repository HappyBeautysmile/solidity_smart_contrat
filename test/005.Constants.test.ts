import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("005.Constants", () => {
  let constants: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const Constants = await ethers.getContractFactory("Constants");
    constants = await Constants.deploy();
    await constants.deployed();
  });

  describe("Constants", async () => {
    it(`Verification : variables`, async () => {
      const MY_ADDRESS = await constants.MY_ADDRESS();
      expect(MY_ADDRESS).to.equal("0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc");

      const MY_UINT = await constants.MY_UINT();
      expect(MY_UINT).to.equal(123);
    });
  });
});
