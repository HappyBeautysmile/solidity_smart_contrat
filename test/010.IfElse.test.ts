import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("010.IfElse", () => {
  let ifElse: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const IfElse = await ethers.getContractFactory("IfElse");
    ifElse = await IfElse.deploy();
    await ifElse.deployed();
  });

  describe("IfElse", async () => {
    it(`Function : foo : Success`, async () => {
      const foo1 = await ifElse.foo(9);
      expect(foo1).to.equal(0);

      const foo2 = await ifElse.foo(19);
      expect(foo2).to.equal(1);

      const foo3 = await ifElse.foo(20);
      expect(foo3).to.equal(2);
    });

    it(`Function : ternary : Success`, async () => {
      const ternary1 = await ifElse.ternary(9);
      expect(ternary1).to.equal(1);

      const ternary2 = await ifElse.ternary(10);
      expect(ternary2).to.equal(2);
    });
  });
});
