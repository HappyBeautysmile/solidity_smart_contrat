import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "../helpers/constant";

describe("021.Events", () => {
  let event: Contract;
  let deployer: SignerWithAddress, one: SignerWithAddress;

  before(async () => {
    [deployer, one] = await ethers.getSigners();

    const Event = await ethers.getContractFactory("Event");
    event = await Event.deploy();
    await event.deployed();
  });

  describe("Event", () => {
    it("Function : test", async () => {
      const test = event.test();

      await expect(test)
        .to.emit(event, "Log")
        .withArgs(deployer.address, "Hello World!");

      await expect(test)
        .to.emit(event, "Log")
        .withArgs(deployer.address, "Hello EVM!");

      await expect(test).to.emit(event, "AnotherLog");
    });
  });
});
