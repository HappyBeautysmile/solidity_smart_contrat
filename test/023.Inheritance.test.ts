import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("023.Inheritance", () => {
  let contractA: Contract,
    contractB: Contract,
    contractC: Contract,
    contractD: Contract,
    contractE: Contract,
    contractF: Contract;

  before(async () => {
    const ContractA = await ethers.getContractFactory("A");
    contractA = await ContractA.deploy();
    await contractA.deployed();

    const ContractB = await ethers.getContractFactory("B");
    contractB = await ContractB.deploy();
    await contractB.deployed();

    const ContractC = await ethers.getContractFactory("C");
    contractC = await ContractC.deploy();
    await contractC.deployed();

    const ContractD = await ethers.getContractFactory("D");
    contractD = await ContractD.deploy();
    await contractD.deployed();

    const ContractE = await ethers.getContractFactory("E");
    contractE = await ContractE.deploy();
    await contractE.deployed();

    const ContractF = await ethers.getContractFactory("F");
    contractF = await ContractF.deploy();
    await contractF.deployed();
  });

  describe("Validations", () => {
    it("ContractA : parent : call : A", async () => {
      const foo = await contractA.foo();
      expect(foo).to.equal("A");
    });

    it("ContractB : inherit A : call : B", async () => {
      const foo = await contractB.foo();
      expect(foo).to.equal("B");
    });

    it("ContractC : inherit A : call : C", async () => {
      const foo = await contractC.foo();
      expect(foo).to.equal("C");
    });

    it("ContractD : inherit B,C : call super : C", async () => {
      const foo = await contractD.foo();
      expect(foo).to.equal("C");
    });

    it("ContractE : inherit C,B : call super : B", async () => {
      const foo = await contractE.foo();
      expect(foo).to.equal("B");
    });

    it("ContractF : inherit A,B : call super : B", async () => {
      const foo = await contractF.foo();
      expect(foo).to.equal("B");
    });
  });
});
