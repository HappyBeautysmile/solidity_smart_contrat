import { anyUint } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import { converter } from "../helpers/unit-converter";

describe("030.Fallback", () => {
  let fallback: Contract, sendToFallback: Contract;

  before(async () => {
    const Fallback = await ethers.getContractFactory("Fallback");
    fallback = await Fallback.deploy();
    await fallback.deployed();

    const SendToFallback = await ethers.getContractFactory("SendToFallback");
    sendToFallback = await SendToFallback.deploy();
    await sendToFallback.deployed();
  });

  describe("SendToFallback", async () => {
    it("Function : transferToFallback : Success : to fallback", async () => {
      const preBalance = await fallback.getBalance();
      expect(preBalance).to.equal(0);

      const transferToFallbackTx = sendToFallback.transferToFallback(
        fallback.address,
        {
          value: converter(1, "ether", "wei"),
        }
      );

      // left gas is under 2300
      await expect(transferToFallbackTx)
        .to.emit(fallback, "Log")
        .withArgs(anyUint);

      const curBalance = await fallback.getBalance();
      expect(curBalance).to.equal(converter(1, "ether", "wei"));
    });

    it("Function : callFallback : Success : to fallback", async () => {
      const preBalance = await fallback.getBalance();
      expect(preBalance).to.equal(converter(1, "ether", "wei"));

      const callFallbackTx = sendToFallback.callFallback(fallback.address, {
        value: converter(1, "ether", "wei"),
      });

      // left gas is over 2300
      await expect(callFallbackTx).to.emit(fallback, "Log").withArgs(anyUint);

      const curBalance = await fallback.getBalance();
      expect(curBalance).to.equal(converter(2, "ether", "wei"));
    });
  });
});
