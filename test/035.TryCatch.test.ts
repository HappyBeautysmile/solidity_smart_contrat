import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

import { ZERO_ADDRESS } from "../helpers/constant";
import { converter } from "../helpers/unit-converter";

describe("035.TryCatch", () => {
  let Foo: ContractFactory;
  let foo: Contract, bar: Contract;

  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    Foo = await ethers.getContractFactory("Foo");

    const Bar = await ethers.getContractFactory("Bar");
    bar = await Bar.deploy();
  });

  describe("Foo", async () => {
    it(`Function : constructor : Failed : ZERO_ADDRESS`, async () => {
      const foo = Foo.deploy(ZERO_ADDRESS);
      await expect(foo).to.revertedWith("invalid address"); // require error
    });

    it(`Function : constructor : Failed : 0x0000000000000000000000000000000000000001`, async () => {
      const foo = Foo.deploy("0x0000000000000000000000000000000000000001");
      await expect(foo).to.revertedWithPanic(PANIC_CODES.ASSERTION_ERROR); // asset error
    });

    it(`Function : constructor : Success : valid address`, async () => {
      const foo = await Foo.deploy(deployer.address);
      await foo.deployed();

      const owner = await foo.owner();
      expect(owner).to.equal(deployer.address);
    });

    it(`Function : myFunc : Failed : invalid variable`, async () => {
      const foo = await Foo.deploy(deployer.address);
      await foo.deployed();

      const myFunc = foo.myFunc(0);
      await expect(myFunc).to.rejectedWith("require failed");
    });

    it(`Function : myFunc : Success : valid variable`, async () => {
      const foo = await Foo.deploy(deployer.address);
      await foo.deployed();

      const myFunc = await foo.myFunc(1);
      expect(myFunc).to.equal("my func was called");
    });
  });

  describe("Bar", async () => {
    it(`Function : tryCatchExternalCall : Failed : invalid variable`, async () => {
      const tryCatchExternalCall = bar.tryCatchExternalCall(0);
      await expect(tryCatchExternalCall)
        .to.emit(bar, "Log")
        .withArgs("external call failed"); // failed log
    });

    it(`Function : tryCatchExternalCall : Success : valid variable`, async () => {
      const tryCatchExternalCall = bar.tryCatchExternalCall(1);
      await expect(tryCatchExternalCall)
        .to.emit(bar, "Log")
        .withArgs("my func was called"); // success log
    });

    it(`Function : tryCatchNewContract : Failed : ZERO_ADDRESS`, async () => {
      const tryCatchNewContract = bar.tryCatchNewContract(ZERO_ADDRESS);
      await expect(tryCatchNewContract)
        .to.emit(bar, "Log")
        .withArgs("invalid address");
    });

    it(`Function : tryCatchNewContract : Failed : 0x0000000000000000000000000000000000000001`, async () => {
      const tryCatchNewContract = bar.tryCatchNewContract(
        "0x0000000000000000000000000000000000000001"
      );
      await expect(tryCatchNewContract)
        .to.emit(bar, "LogBytes")
        .withArgs(
          "0x4e487b710000000000000000000000000000000000000000000000000000000000000001"
        );
    });

    it(`Function : tryCatchNewContract : Success : valid address`, async () => {
      const tryCatchNewContract = bar.tryCatchNewContract(deployer.address);
      await expect(tryCatchNewContract)
        .to.emit(bar, "Log")
        .withArgs("Foo created");
    });
  });
});
