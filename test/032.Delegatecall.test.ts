import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import { ZERO_ADDRESS } from "../helpers/constant";
import { converter } from "../helpers/unit-converter";

describe("032.Delegatecall", () => {
  let a001: Contract, b001: Contract;

  let deployer: SignerWithAddress, one: SignerWithAddress;

  before(async () => {
    [deployer, one] = await ethers.getSigners();

    const B001 = await ethers.getContractFactory("B001");
    b001 = await B001.deploy();
    await b001.deployed();

    const A001 = await ethers.getContractFactory("A001");
    a001 = await A001.connect(one).deploy();
    await a001.connect(one).deployed();
  });

  describe("B001", async () => {
    it("Function : call : setVars : Success : change B001's variables", async () => {
      const preNum = await b001.num();
      const preSender = await b001.sender();
      const preValue = await b001.value();
      expect(preNum).to.equal(0);
      expect(preSender).to.equal(ZERO_ADDRESS);
      expect(preValue).to.equal(0);

      const setVarsTx = await b001.setVars(1, {
        value: converter(1, "ether", "wei"),
      });
      await setVarsTx.wait();

      const curNum = await b001.num();
      const curSender = await b001.sender();
      const curValue = await b001.value();
      expect(curNum).to.equal(1);
      expect(curSender).to.equal(deployer.address);
      expect(curValue).to.equal(converter(1, "ether", "wei"));
    });
  });

  describe("A001", async () => {
    it("Function : delegatecall : setVars : Success : change A001's variables", async () => {
      const preNum = await a001.num();
      const preSender = await a001.sender();
      const preValue = await a001.value();
      expect(preNum).to.equal(0);
      expect(preSender).to.equal(ZERO_ADDRESS);
      expect(preValue).to.equal(0);

      const setVarsTx = await a001.connect(one).setVars(b001.address, 10, {
        value: converter(10, "ether", "wei"),
      });
      await setVarsTx.wait();

      const curNum = await a001.num();
      const curSender = await a001.sender();
      const curValue = await a001.value();
      expect(curNum).to.equal(10);
      expect(curSender).to.equal(one.address);
      expect(curValue).to.equal(converter(10, "ether", "wei"));
    });

    it("Validation : B001's variables are not changed", async () => {
      const curNum = await b001.num();
      const curSender = await b001.sender();
      const curValue = await b001.value();
      expect(curNum).to.equal(1);
      expect(curSender).to.equal(deployer.address);
      expect(curValue).to.equal(converter(1, "ether", "wei"));
    });
  });
});
