import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("006.Immutable", () => {
  let immutable: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();
  });

  describe("Immutable", async () => {
    it(`Function : constructor : need parameters to set immutable variables`, async () => {
      const Immutable = await ethers.getContractFactory("Immutable");
      immutable = await Immutable.deploy(123);
      await immutable.deployed();
    });

    it(`Verification : variables`, async () => {
      const MY_ADDRESS = await immutable.MY_ADDRESS();
      expect(MY_ADDRESS).to.equal(deployer.address);

      const MY_UINT = await immutable.MY_UINT();
      expect(MY_UINT).to.equal(123);
    });
  });
});
