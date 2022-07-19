import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("002.FirstApp", () => {
  let counter: Contract;

  before(async () => {
    const Counter = await ethers.getContractFactory("Counter002");
    counter = await Counter.deploy();
    await counter.deployed();
  });

  describe("Validations", () => {
    it("Function : get : success", async () => {
      const get = await counter.get();
      expect(get).to.equal(0);
    });

    it("Function : inc : succeed", async () => {
      const incTx = await counter.inc();
      await incTx.wait();

      const get = await counter.get();
      expect(get).to.equal(1);
    });

    it("Function : dec : succeed", async () => {
      const decTx = await counter.dec();
      await decTx.wait();

      const get = await counter.get();
      expect(get).to.equal(0);
    });

    it("Function : dec : fail", async () => {
      const decTx = counter.dec();

      await expect(decTx).to.reverted;
      // it reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)
    });
  });
});
