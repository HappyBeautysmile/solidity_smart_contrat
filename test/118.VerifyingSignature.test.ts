import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, web3 } from "hardhat";

describe("118.VerifyingSignature", () => {
  let verifySignature: Contract;
  let deployer: SignerWithAddress, one: SignerWithAddress;
  let hash: string, signature: string;

  before(async () => {
    [deployer, one] = await ethers.getSigners();

    const VerifySignature = await ethers.getContractFactory("VerifySignature");
    verifySignature = await VerifySignature.deploy();
    await verifySignature.deployed();
  });

  describe("VerifySignature", async () => {
    it(`Get hash using getMessageHash`, async () => {
      hash = await verifySignature.getMessageHash(one.address, 1, "hello", 1);
    });

    it(`Get Signature using web3`, async () => {
      signature = await web3.eth.sign(hash, deployer.address, console.log);
    });

    it(`Function : verify : Success`, async () => {
      const verify = await verifySignature.verify(
        deployer.address,
        one.address,
        1,
        "hello",
        1,
        signature
      );
      expect(verify).to.equal(true);
    });
  });
});
