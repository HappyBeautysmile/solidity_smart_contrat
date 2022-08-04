import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { converter } from "../helpers/unit-converter";

describe("008.EtherAndWei", () => {
  let etherUnits: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const EtherUnits = await ethers.getContractFactory("EtherUnits");
    etherUnits = await EtherUnits.deploy();
    await etherUnits.deployed();
  });

  describe("EtherUnits", async () => {
    it(`Variables : oneWei, oneEther : Success`, async () => {
      const oneWei = await etherUnits.oneWei();
      expect(oneWei).to.equal(1);

      const oneEther = await etherUnits.oneEther();
      expect(oneEther).to.equal(converter(1, "ether", "wei")); // converter
    });

    it(`Variables : isOneWei, isOneEther : Success`, async () => {
      const isOneWei = await etherUnits.isOneWei();
      expect(isOneWei).to.equal(true);

      const isOneEther = await etherUnits.isOneEther();
      expect(isOneEther).to.equal(true);
    });
  });
});
