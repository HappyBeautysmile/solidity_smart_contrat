import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import bigInt from "big-integer";
import { expect } from "chai";
import { Contract, utils } from "ethers";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "../helpers/constant";

describe("003.PrimitiveDataTypes", () => {
  let primitives: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const Primitives = await ethers.getContractFactory("Primitives");
    primitives = await Primitives.deploy();
    await primitives.deployed();
  });

  describe("Primitives", async () => {
    it(`Verification : variables`, async () => {
      const boo = await primitives.boo();
      expect(boo).to.equal(true);

      const u8 = await primitives.u8();
      expect(u8).to.equal(1);

      const u256 = await primitives.u256();
      expect(u256).to.equal(456);

      const u = await primitives.u();
      expect(u).to.equal(123);

      const i8 = await primitives.i8();
      expect(i8).to.equal(-1);

      const i256 = await primitives.i256();
      expect(i256).to.equal(456);

      const i = await primitives.i();
      expect(i).to.equal(-123);

      const minUint = await primitives.minUint();
      expect(minUint).to.equal(0);

      const maxUint = await primitives.maxUint();
      const calcMaxUint = bigInt(2 ** 256).toString();
      // expect(maxUint).to.equal(calcMaxUint);

      // const minInt = await primitives.minInt();
      // const calcMinInt = bigInt(-(2 ** 255)).toString();
      // expect(minInt).to.equal(calcMinInt);

      const maxInt = await primitives.maxInt();
      const calcMaxInt = bigInt(2 ** 255).toString();
      // expect(maxInt).to.equal(calcMaxInt);

      const addr = await primitives.addr();
      expect(addr).to.equal(deployer.address);
    });

    it(`Verification : default variables`, async () => {
      const defaultBoo = await primitives.defaultBoo();
      expect(defaultBoo).to.equal(false);

      const defaultUint = await primitives.defaultUint();
      expect(defaultUint).to.equal(0);

      const defaultInt = await primitives.defaultInt();
      expect(defaultInt).to.equal(0);

      const defaultAddr = await primitives.defaultAddr();
      expect(defaultAddr).to.equal(ZERO_ADDRESS);
    });
  });
});
