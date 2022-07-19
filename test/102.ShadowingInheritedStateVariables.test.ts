import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("102.ShadowingInheritedStateVariables", () => {
  let contractA: Contract, contractC: Contract;

  before(async () => {
    const ContractA = await ethers.getContractFactory("ContractA");
    contractA = await ContractA.deploy();
    await contractA.deployed();

    const ContractC = await ethers.getContractFactory("ContractC");
    contractC = await ContractC.deploy();
    await contractC.deployed();
  });

  describe("Validations", () => {
    it("ContractA : parent : getName : A", async () => {
      const foo = await contractA.getName();
      expect(foo).to.equal("Contract A");
    });

    it("ContractC : inherited : getName : C", async () => {
      const foo = await contractC.getName();
      expect(foo).to.equal("Contract C");
    });
  });
});
