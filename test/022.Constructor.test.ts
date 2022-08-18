import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "../helpers/constant";

describe("021.Constructor", () => {
  let x: Contract,
    y: Contract,
    b002: Contract,
    c002: Contract,
    d002: Contract,
    e: Contract;
  let deployer: SignerWithAddress, one: SignerWithAddress;

  before(async () => {
    [deployer, one] = await ethers.getSigners();
  });

  describe("Constructor", () => {
    it("Function : X : constructor", async () => {
      const X = await ethers.getContractFactory("X");
      x = await X.deploy("xName");
      await x.deployed();

      expect(x).to.emit(x, "XCall");

      const name = await x.name();
      expect(name).to.equal("xName");
    });

    it("Function : Y : constructor", async () => {
      const Y = await ethers.getContractFactory("Y");
      y = await Y.deploy("yText");
      await y.deployed();

      expect(y).to.emit(y, "YCall");

      const text = await y.text();
      expect(text).to.equal("yText");
    });

    it("Function : B002 : constructor", async () => {
      const B002 = await ethers.getContractFactory("B002");
      b002 = await B002.deploy();
      await b002.deployed();

      const name = await b002.name();
      expect(name).to.equal("Input to X");

      const text = await b002.text();
      expect(text).to.equal("Input to Y");
    });

    it("Function : C002 : constructor", async () => {
      const C002 = await ethers.getContractFactory("C002");
      c002 = await C002.deploy("cName", "cText");
      await c002.deployed();

      const name = await c002.name();
      expect(name).to.equal("cName");

      const text = await c002.text();
      expect(text).to.equal("cText");
    });

    it("Function : D002 : constructor", async () => {
      const D002 = await ethers.getContractFactory("D002");
      d002 = await D002.deploy();
      const receipt = await d002.deployed();

      console.log("receipt", receipt);
      expect(Object.keys(receipt.interface.events)).to.deep.equal([
        "DCall()",
        "XCall()",
        "YCall()",
      ]);
    });
  });
});
