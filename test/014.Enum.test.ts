import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("014.Enum", () => {
  let enumContract: Contract;

  before(async () => {
    const Enum = await ethers.getContractFactory("Enum");
    enumContract = await Enum.deploy();
    await enumContract.deployed();
  });

  describe("Enum", () => {
    it("Function : get : Success : default is the first element", async () => {
      const get = await enumContract.get();
      expect(get).to.equal(0);
    });

    it("Function : transaction : set : Success : set other Enum value", async () => {
      const set1Tx = await enumContract.set(1);
      await set1Tx.wait();

      const get1 = await enumContract.get();
      expect(get1).to.equal(1);

      const set3Tx = await enumContract.set(3);
      await set3Tx.wait();

      const get3 = await enumContract.get();
      expect(get3).to.equal(3);
    });

    it("Function : transaction : set : Failed : can't set out of range", async () => {
      const setTx = enumContract.set(5);
      await expect(setTx).to.reverted;
    });

    it("Function : transaction : cancel : Success : set to a specific enum (Canceled)", async () => {
      const cancelTx = await enumContract.cancel();
      await cancelTx.wait();

      const get = await enumContract.get();
      await expect(get).to.equal(4);
    });

    it("Function : transaction : cancel : Success : if use `delete` command, it resets the enum to it's first value.", async () => {
      const resetTx = await enumContract.reset();
      await resetTx.wait();

      const get = await enumContract.get();
      await expect(get).to.equal(0);
    });
  });
});
