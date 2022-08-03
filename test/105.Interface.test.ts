import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("105.Interface", () => {
  let counter: Contract, myContract: Contract, uniswapExample: Contract;

  before(async () => {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.deployed();

    const MyContract = await ethers.getContractFactory("MyContract");
    myContract = await MyContract.deploy();
    await myContract.deployed();

    const UniswapExample = await ethers.getContractFactory("UniswapExample");
    uniswapExample = await UniswapExample.deploy();
    await uniswapExample.deployed();
  });

  describe("Validations", () => {
    describe("Counter", async () => {
      it("Variable : call : count : 0", async () => {
        const count = await counter.count();
        expect(count).to.equal(0);
      });

      it("Function : transaction : increment : Success : count : 1", async () => {
        const incrementTx = await counter.increment();
        await incrementTx.wait();

        const count = await counter.count();
        expect(count).to.equal(1);
      });
    });

    describe("MyContract", async () => {
      it("Variable : call : getCount : 1", async () => {
        const getCount = await myContract.getCount(counter.address);
        expect(getCount).to.equal(1);
      });

      it("Function : transaction : incrementCounterTx : Success : count : 2", async () => {
        const incrementCounterTx = await myContract.incrementCounter(
          counter.address
        );
        await incrementCounterTx.wait();

        const getCount = await myContract.getCount(counter.address);
        expect(getCount).to.equal(2);
      });
    });

    describe("UniswapExample", async () => {
      it("Only available in Ethereum Mainnet", async () => {
        // const getTokenReserves = await uniswapExample.getTokenReserves();
        // console.log("getTokenReserves", getTokenReserves);
      });
    });
  });
});
