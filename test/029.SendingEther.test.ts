import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import { converter } from "../helpers/unit-converter";

describe("029.SendingEther", () => {
  let receiveEther: Contract, sendEther: Contract;

  before(async () => {
    const ReceiveEther = await ethers.getContractFactory("ReceiveEther");
    receiveEther = await ReceiveEther.deploy();
    await receiveEther.deployed();

    const SendEther = await ethers.getContractFactory("SendEther");
    sendEther = await SendEther.deploy();
    await sendEther.deployed();
  });

  describe("SendingEther", async () => {
    it("Function : sendViaTransfer : Success : to receiveEther", async () => {
      const preBalance = await receiveEther.getBalance();
      expect(preBalance).to.equal(0);

      const sendViaTransferTx = sendEther.sendViaTransfer(
        receiveEther.address,
        {
          value: converter(1, "ether", "wei"),
        }
      );
      await expect(sendViaTransferTx).to.emit(receiveEther, "ReceiveCalled");

      const curBalance = await receiveEther.getBalance();
      expect(curBalance).to.equal(converter(1, "ether", "wei"));
    });

    it("Function : sendViaSend : Success : to receiveEther", async () => {
      const preBalance = await receiveEther.getBalance();
      expect(preBalance).to.equal(converter(1, "ether", "wei"));

      const sendViaSendTx = sendEther.sendViaSend(receiveEther.address, {
        value: converter(1, "ether", "wei"),
      });
      await expect(sendViaSendTx).to.emit(receiveEther, "ReceiveCalled");

      const curBalance = await receiveEther.getBalance();
      expect(curBalance).to.equal(converter(2, "ether", "wei"));
    });

    it("Function : sendViaCall : Success : to receiveEther", async () => {
      const preBalance = await receiveEther.getBalance();
      expect(preBalance).to.equal(converter(2, "ether", "wei"));

      const sendViaCallTx = sendEther.sendViaCall(receiveEther.address, {
        value: converter(1, "ether", "wei"),
      });
      await expect(sendViaCallTx).to.emit(receiveEther, "ReceiveCalled");

      const curBalance = await receiveEther.getBalance();
      expect(curBalance).to.equal(converter(3, "ether", "wei"));
    });
  });
});
