import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("119.GasOptimizations", () => {
  const SAMPLE = Array.from({ length: 100 }, (_, idx) => idx + 1); // 1 ~ 100

  let gasGolf: Contract;
  let deployer: SignerWithAddress;
  let originGasConsumption: number,
    firstGasConsumption: number,
    secondGasConsumption: number,
    thirdGasConsumption: number,
    lastGasConsumption: number;
  before(async () => {
    [deployer] = await ethers.getSigners();

    const GasGolf = await ethers.getContractFactory("GasGolf");
    gasGolf = await GasGolf.deploy();
    await gasGolf.deployed();
  });

  describe("GasGolf", async () => {
    it(`Function : sumIfEvenAndLessThan99 : Success`, async () => {
      const sumIfEvenAndLessThan99Tx = await gasGolf.sumIfEvenAndLessThan99(
        SAMPLE
      );
      await sumIfEvenAndLessThan99Tx.wait();

      const total = await gasGolf.total();
      expect(total).to.equal(2450);

      originGasConsumption = sumIfEvenAndLessThan99Tx.gasPrice;
    });

    it(`Function : first : Success : less than originGasConsumption`, async () => {
      const firstTx = await gasGolf.first(SAMPLE);
      await firstTx.wait();

      const total = await gasGolf.total();
      expect(total).to.equal(2450);

      firstGasConsumption = firstTx.gasPrice;
      expect(firstGasConsumption).to.lessThan(originGasConsumption);
    });

    it(`Function : second : Success : less than firstGasConsumption`, async () => {
      const secondTx = await gasGolf.second(SAMPLE);
      await secondTx.wait();

      const total = await gasGolf.total();
      expect(total).to.equal(2450);

      secondGasConsumption = secondTx.gasPrice;
      expect(secondGasConsumption).to.lessThan(firstGasConsumption);
    });

    it(`Function : third : Success : less than secondGasConsumption`, async () => {
      const thirdTx = await gasGolf.third(SAMPLE);
      await thirdTx.wait();

      const total = await gasGolf.total();
      expect(total).to.equal(2450);

      thirdGasConsumption = thirdTx.gasPrice;
      expect(thirdGasConsumption).to.lessThan(secondGasConsumption);
    });

    it(`Function : last : Success : less than thirdGasConsumption : Gas optimizations`, async () => {
      const lastTx = await gasGolf.last(SAMPLE);
      await lastTx.wait();

      const total = await gasGolf.total();
      expect(total).to.equal(2450);

      lastGasConsumption = lastTx.gasPrice;
      expect(lastGasConsumption).to.lessThan(thirdGasConsumption);
    });
  });
});
