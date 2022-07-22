import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import { ZERO_ADDRESS } from "../helpers/constant";
import { converter } from "../helpers/unit-converter";

describe("109.Call", () => {
  let receiver: Contract, caller: Contract;

  let one: SignerWithAddress, two: SignerWithAddress, three: SignerWithAddress;

  before(async () => {
    [one, two, three] = await ethers.getSigners();

    const Receiver = await ethers.getContractFactory("Receiver");
    receiver = await Receiver.deploy();
    await receiver.deployed();

    const Caller = await ethers.getContractFactory("Caller");
    caller = await Caller.deploy();
    await caller.deployed();
  });

  describe("Receiver", async () => {
    it("Function : foo : Success : to contract", async () => {
      const preBalance = await receiver.getBalance();
      expect(preBalance).to.equal(0);

      const fooTx = await receiver.foo("hello world", 1, {
        value: converter(1, "ether", "wei"),
      });

      await expect(fooTx)
        .to.emit(receiver, "Received")
        .withArgs(one.address, converter(1, "ether", "wei"), "hello world");

      const curBalance = await receiver.getBalance();
      expect(curBalance).to.equal(converter(1, "ether", "wei"));

      const result = await fooTx.wait();
      await expect(result.type).to.equal(2);
    });
  });

  describe("Caller : use Receive function", async () => {
    it("Function : testCallFoo : Success", async () => {
      const preCallerBalance = await caller.getBalance();
      expect(preCallerBalance).to.equal(0);

      const preReceiverBalance = await receiver.getBalance();
      expect(preReceiverBalance).to.equal(converter(1, "ether", "wei"));

      const testCallFooTx = caller.testCallFoo(receiver.address, {
        value: converter(1, "ether", "wei"),
      });

      // Caller.testCallFoo
      await expect(testCallFooTx)
        .to.emit(caller, "Response")
        .withArgs(true, anyValue);

      // Receiver.foo
      await expect(testCallFooTx)
        .to.emit(receiver, "Received")
        .withArgs(caller.address, converter(1, "ether", "wei"), "call foo");

      const curCallerBalance = await caller.getBalance();
      expect(curCallerBalance).to.equal(0);

      const curReceiverBalance = await receiver.getBalance();
      expect(curReceiverBalance).to.equal(converter(2, "ether", "wei"));
    });

    it("Function : testCallDoesNotExist : Success : Caller call does not exist function : it calls fallback function", async () => {
      const testCallDoesNotExistTx = caller.testCallDoesNotExist(
        receiver.address
      );

      // Caller.testCallDoesNotExist
      await expect(testCallDoesNotExistTx)
        .to.emit(caller, "Response")
        .withArgs(true, "0x");

      // Receiver.fallback
      await expect(testCallDoesNotExistTx)
        .to.emit(receiver, "Received")
        .withArgs(caller.address, 0, "Fallback was called");
    });
  });
});
