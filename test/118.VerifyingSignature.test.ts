import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("118.VerifyingSignature", () => {
  let verifySignature: Contract;
  let deployer: SignerWithAddress, one: SignerWithAddress;
  let hash: string;
  before(async () => {
    [deployer, one] = await ethers.getSigners();

    const VerifySignature = await ethers.getContractFactory("VerifySignature");
    verifySignature = await VerifySignature.deploy();
    await verifySignature.deployed();
  });

  describe("VerifySignature", async () => {
    it(`Function : getMessageHash : Success`, async () => {
      hash = await verifySignature.getMessageHash(one.address, 1, "hello", 1);
      console.log("hash", hash);
    });
  });
});
