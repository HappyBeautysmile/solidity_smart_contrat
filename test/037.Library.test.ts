import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("037.Library", () => {
  let testSafeMath: Contract, testArray: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const TestSafeMath = await ethers.getContractFactory("TestSafeMath");
    testSafeMath = await TestSafeMath.deploy();
    await testSafeMath.deployed();

    const TestArray = await ethers.getContractFactory("TestArray");
    testArray = await TestArray.deploy();
    await testArray.deployed();
  });

  describe("TestSafeMath", async () => {
    it(`Function : testAdd : Success`, async () => {
      const testAdd = await testSafeMath.testAdd(1, 2);
      expect(testAdd).to.equal(3);
    });

    it(`Function : testAddWithMaxUint : Failed : uint256 overflow`, async () => {
      const testAddWithMaxUint = testSafeMath.testAddWithMaxUint(1);

      await expect(testAddWithMaxUint).to.revertedWithPanic(
        PANIC_CODES.ARITHMETIC_UNDER_OR_OVERFLOW
      );
    });

    it(`Function : testSquareRoot : Success`, async () => {
      const testSquareRoot4 = await testSafeMath.testSquareRoot(4);
      expect(testSquareRoot4).to.equal(2);

      const testSquareRoot5 = await testSafeMath.testSquareRoot(5);
      expect(testSquareRoot5).to.equal(2);

      const testSquareRoot9 = await testSafeMath.testSquareRoot(9);
      expect(testSquareRoot9).to.equal(3);

      const testSquareRoot15 = await testSafeMath.testSquareRoot(15);
      expect(testSquareRoot15).to.equal(3);
    });
  });

  describe("TestArray", async () => {
    it(`Function : testArrayRemove : Success`, async () => {
      // before [1,2,3]
      const testArrayRemoveTx = await testArray.testArrayRemove(0);
      await testArrayRemoveTx.wait();
      // after [3,2]

      const index0 = await testArray.arr(0);
      expect(index0).to.equal(3);

      const index1 = await testArray.arr(1);
      expect(index1).to.equal(2);
    });
  });
});
