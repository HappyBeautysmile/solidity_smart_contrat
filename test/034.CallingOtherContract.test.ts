import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import { converter } from "../helpers/unit-converter";

describe("034.CallingOtherContract", () => {
  let callee001: Contract, caller001: Contract;

  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const Callee001 = await ethers.getContractFactory("Callee001");
    callee001 = await Callee001.deploy();

    const Caller001 = await ethers.getContractFactory("Caller001");
    caller001 = await Caller001.deploy();
  });

  describe("Callee001", async () => {
    it(`Review Function : getSelector : Success : "setX(uint256)"`, async () => {
      const setX = "setX(uint256)";
      const setXBytes4 = "0x4018d9aa";

      const getSelector = await callee001.getSelector(setX);
      expect(getSelector).to.equal(setXBytes4);
    });

    it(`Function : transaction : setX : Success : set Callee001's variables`, async () => {
      const preX = await callee001.x();
      expect(preX).to.equal(0);

      const setXTx = await callee001.setX(1);
      await setXTx.wait();

      const curX = await callee001.x();
      expect(curX).to.equal(1);
    });

    it(`Function : transaction : setXAndSendEther : Success : set Callee001's variables`, async () => {
      const preX = await callee001.x();
      expect(preX).to.equal(1);
      const preValue = await callee001.value();
      expect(preValue).to.equal(0);

      const setXAndSendEtherTx = await callee001.setXAndSendEther(2, {
        value: converter(1, "ether", "wei"),
      });
      await setXAndSendEtherTx.wait();

      const curX = await callee001.x();
      expect(curX).to.equal(2);
      const curValue = await callee001.value();
      expect(curValue).to.equal(converter(1, "ether", "wei"));
    });
  });

  describe("Caller001", async () => {
    it(`Function : transaction : setX : call Callee's function : Success : set Callee001's variables`, async () => {
      const preX = await callee001.x();
      expect(preX).to.equal(2);

      const setXTx = await caller001.setX(callee001.address, 3);
      await setXTx.wait();

      const curX = await callee001.x();
      expect(curX).to.equal(3);
    });

    it(`Function : transaction : setXFromAddress : call Callee's function : Success : set Callee001's variables`, async () => {
      const preX = await callee001.x();
      expect(preX).to.equal(3);

      const setXFromAddressTx = await caller001.setXFromAddress(
        callee001.address,
        4
      );
      await setXFromAddressTx.wait();

      const curX = await callee001.x();
      expect(curX).to.equal(4);
    });

    it(`Function : transaction : setXAndSendEther : call Callee's function : Success : set Callee001's variables`, async () => {
      const preX = await callee001.x();
      expect(preX).to.equal(4);
      const preValue = await callee001.value();
      expect(preValue).to.equal(converter(1, "ether", "wei"));

      const setXAndSendEtherTx = await caller001.setXAndSendEther(
        callee001.address,
        5,
        {
          value: converter(2, "ether", "wei"),
        }
      );
      await setXAndSendEtherTx.wait();

      const curX = await callee001.x();
      expect(curX).to.equal(5);
      const curValue = await callee001.value();
      expect(curValue).to.equal(converter(2, "ether", "wei"));
    });
  });
});
