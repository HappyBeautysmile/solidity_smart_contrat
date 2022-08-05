import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("012.Mapping", () => {
  let mapping: Contract, nestedMapping: Contract;
  let deployer: SignerWithAddress,
    one: SignerWithAddress,
    two: SignerWithAddress;

  before(async () => {
    [deployer, one, two] = await ethers.getSigners();

    const Mapping = await ethers.getContractFactory("Mapping");
    mapping = await Mapping.deploy();
    await mapping.deployed();

    const NestedMapping = await ethers.getContractFactory("NestedMapping");
    nestedMapping = await NestedMapping.deploy();
    await nestedMapping.deployed();
  });

  describe("Mapping", async () => {
    it("Validation : default value : 0", async () => {
      const get1 = await mapping.get(deployer.address);
      const get2 = await mapping.get(one.address);
      const get3 = await mapping.get(two.address);
      expect(0).to.equal(get1).and.to.equal(get2).and.to.equal(get3);
    });

    it(`Function : transaction : set : Success`, async () => {
      const set1 = await mapping.set(deployer.address, 1);
      await set1.wait();

      const get1 = await mapping.get(deployer.address);
      expect(get1).to.equal(1);

      const set2 = await mapping.set(one.address, 2);
      await set2.wait();

      const get2 = await mapping.get(one.address);
      expect(get2).to.equal(2);

      const set3 = await mapping.set(two.address, 3);
      await set3.wait();

      const get3 = await mapping.get(two.address);
      expect(get3).to.equal(3);
    });

    it(`Function : transaction : Success : get default value`, async () => {
      const remove1 = await mapping.remove(deployer.address);
      await remove1.wait();

      const get1 = await mapping.get(deployer.address);
      expect(get1).to.equal(0);

      const remove2 = await mapping.remove(one.address);
      await remove2.wait();

      const get2 = await mapping.get(one.address);
      expect(get2).to.equal(0);

      const remove3 = await mapping.remove(two.address);
      await remove3.wait();

      const get3 = await mapping.get(two.address);
      expect(get3).to.equal(0);
    });
  });

  describe("NestedMapping", async () => {
    it("Validation : default value : false", async () => {
      const get1 = await nestedMapping.get(deployer.address, 1);
      const get2 = await nestedMapping.get(deployer.address, 2);
      const get3 = await nestedMapping.get(one.address, 1);
      expect(false).to.equal(get1).and.to.equal(get2).and.to.equal(get3);
    });

    it(`Function : transaction : set : Success`, async () => {
      const set1 = await nestedMapping.set(deployer.address, 1, true);
      await set1.wait();

      const get1 = await nestedMapping.get(deployer.address, 1);
      expect(get1).to.equal(true);

      const set2 = await nestedMapping.set(deployer.address, 2, true);
      await set2.wait();

      const get2 = await nestedMapping.get(deployer.address, 2);
      expect(get2).to.equal(true);

      const set3 = await nestedMapping.set(one.address, 1, true);
      await set3.wait();

      const get3 = await nestedMapping.get(one.address, 1);
      expect(get3).to.equal(true);
    });

    it(`Function : transaction : Success : get default value : false`, async () => {
      const remove1 = await nestedMapping.remove(deployer.address, 1);
      await remove1.wait();

      const get1 = await nestedMapping.get(deployer.address, 1);
      expect(get1).to.equal(false);

      const remove2 = await nestedMapping.remove(deployer.address, 2);
      await remove2.wait();

      const get2 = await nestedMapping.get(deployer.address, 2);
      expect(get2).to.equal(false);

      const remove3 = await nestedMapping.remove(one.address, 1);
      await remove3.wait();

      const get3 = await nestedMapping.get(one.address, 1);
      expect(get3).to.equal(false);
    });
  });
});
