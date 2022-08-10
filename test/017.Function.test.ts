import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("017.Function", () => {
  let functionContract: Contract;

  before(async () => {
    const Function = await ethers.getContractFactory("Function");
    functionContract = await Function.deploy();
    await functionContract.deployed();
  });

  describe("Function", () => {
    it("Function : returnMany : Success", async () => {
      const [one, two, three] = await functionContract.returnMany();
      expect(one).to.equal(1);
      expect(two).to.equal(true);
      expect(three).to.equal(2);
    });

    it("Function : named : Success", async () => {
      const named = await functionContract.named();
      const { x, b, y } = named;
      expect(x).to.equal(1);
      expect(b).to.equal(true);
      expect(y).to.equal(2);
    });

    it("Function : assigned : Success", async () => {
      const assigned = await functionContract.assigned();
      const { x, b, y } = assigned;
      expect(x).to.equal(1);
      expect(b).to.equal(true);
      expect(y).to.equal(2);
    });

    it("Function : destructuringAssignments : Success", async () => {
      const [one, two, three, four, five] =
        await functionContract.destructuringAssignments();
      expect(one).to.equal(1);
      expect(two).to.equal(true);
      expect(three).to.equal(2);
      expect(four).to.equal(4);
      expect(five).to.equal(6);
    });

    it("Function : arrayInput : Success", async () => {
      const arrayInput = await functionContract.arrayInput([1, 2, 3]);
      expect(arrayInput).to.deep.equal([1, 2, 3]);
    });

    it("Function : arrayOutput : Success", async () => {
      const arrayOutput = await functionContract.arrayOutput([]);
      expect(arrayOutput).to.deep.equal([]);
    });
  });
});
