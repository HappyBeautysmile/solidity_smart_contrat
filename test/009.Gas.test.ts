import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("009.Gas", () => {
  let gas: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const Gas = await ethers.getContractFactory("Gas");
    gas = await Gas.deploy();
    await gas.deployed();
  });

  describe("Gas", async () => {
    it(`Function : forever : Failed`, async () => {
      const preBalance = await deployer.getBalance();
      const forever = gas.forever();

      await expect(forever).to.reverted; // will be reverted.

      await forever.catch(({ name, message }: any) => {
        expect(name).to.equal("TransactionExecutionError");
        expect(message).to.equal("Transaction ran out of gas");
      }); // verify reason of error

      const curBalance = await deployer.getBalance();
      expect(curBalance).to.lessThan(preBalance); // used gas
    });
  });
});
