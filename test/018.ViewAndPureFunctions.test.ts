import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("018.ViewAndPureFunctions", () => {
  let viewAndPure: Contract;

  before(async () => {
    const ViewAndPure = await ethers.getContractFactory("ViewAndPure");
    viewAndPure = await ViewAndPure.deploy();
    await viewAndPure.deployed();
  });

  describe("ViewAndPure", () => {
    it("Function : x : Success", async () => {
      const x = await viewAndPure.x();
      expect(x).to.equal(1);
    });

    it("Function : addToX : Success : view", async () => {
      const addToX = await viewAndPure.addToX(2);
      expect(addToX).to.equal(3);
    });

    it("Function : add : Success : pure", async () => {
      const add = await viewAndPure.add(1, 2);
      expect(add).to.equal(3);
    });

    it("Function : x : Success", async () => {
      const x = await viewAndPure.x();
      expect(x).to.equal(1);
    });
  });
});
