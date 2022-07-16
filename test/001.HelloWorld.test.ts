import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("001.HelloWorld", () => {
  let helloWorld: Contract;

  before(async () => {
    const HelloWorld = await ethers.getContractFactory("HelloWorld001");
    helloWorld = await HelloWorld.deploy();
    helloWorld.deployed();
  });

  describe("Validations", () => {
    it("Function : greet : success", async () => {
      const greet = await helloWorld.greet();
      expect(greet).to.equal("Hello World!");
    });
  });
});
