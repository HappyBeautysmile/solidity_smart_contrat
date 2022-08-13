import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("019.Error", () => {
  let error: Contract;

  before(async () => {
    const Error = await ethers.getContractFactory("Error");
    error = await Error.deploy();
    await error.deployed();
  });

  describe("Error", () => {
    it("Function : testRequire : Failed : Input must be greater than 10", async () => {
      const testRequire = error.testRequire(10);
      await expect(testRequire).revertedWith("Input must be greater than 10");
    });

    it("Function : testRequire : Success", async () => {
      const testRequire = error.testRequire(11);
      await expect(testRequire);
    });

    it("Function : testRevert : Failed : Input must be greater than 10", async () => {
      const testRevert = error.testRevert(10);
      await expect(testRevert).revertedWith("Input must be greater than 10");
    });

    it("Function : testRevert : Success", async () => {
      const testRevert = error.testRevert(11);
      await expect(testRevert);
    });

    it("Function : testAssert : Success", async () => {
      const testAssert = error.testAssert();
      await expect(testAssert);
    });

    it("Function : testAssert : Failed : Set invalid number", async () => {
      const preNum = await error.num();
      expect(preNum).to.equal(0);

      const setNumTx = await error.setNum(1);
      await setNumTx.wait();

      const curNum = await error.num();
      expect(curNum).to.equal(1);

      const testAssert = error.testAssert();
      await expect(testAssert).revertedWithPanic();
    });

    it("Function : testCustomError : Failed : InsufficientBalance", async () => {
      const testCustomError = error.testCustomError(10);
      await expect(testCustomError)
        .to.revertedWithCustomError(error, "InsufficientBalance")
        .withArgs(0, 10);
    });
  });
});
