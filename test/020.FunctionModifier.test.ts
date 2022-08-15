import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "../helpers/constant";

describe("020.FunctionModifier", () => {
  let functionModifier: Contract;
  let deployer: SignerWithAddress, one: SignerWithAddress;

  before(async () => {
    [deployer, one] = await ethers.getSigners();

    const FunctionModifier = await ethers.getContractFactory(
      "FunctionModifier"
    );
    functionModifier = await FunctionModifier.deploy();
    await functionModifier.deployed();
  });

  describe("FunctionModifier", () => {
    it("Validation : values", async () => {
      const owner = await functionModifier.owner();
      expect(owner).to.equal(deployer.address);

      const x = await functionModifier.x();
      expect(x).to.equal(10);

      const locked = await functionModifier.locked();
      expect(locked).to.equal(false);
    });

    it("Function : changeOwner : Failed : Not owner", async () => {
      const changeOwnerTx = functionModifier
        .connect(one)
        .changeOwner(one.address);

      await expect(changeOwnerTx).to.revertedWith("Not owner");

      const owner = await functionModifier.owner();
      expect(owner).to.equal(deployer.address);
    });

    it("Function : changeOwner : Failed : Not valid address", async () => {
      const changeOwnerTx = functionModifier.changeOwner(ZERO_ADDRESS);

      await expect(changeOwnerTx).to.revertedWith("Not valid address");

      const owner = await functionModifier.owner();
      expect(owner).to.equal(deployer.address);
    });

    it("Function : changeOwner : Success", async () => {
      const preOwner = await functionModifier.owner();
      expect(preOwner).to.equal(deployer.address);

      const changeOwnerTx = await functionModifier.changeOwner(one.address);
      await changeOwnerTx.wait();

      const curOwner = await functionModifier.owner();
      expect(curOwner).to.equal(one.address);
    });

    it("Function : recursion : Success", async () => {
      const preX = await functionModifier.x();
      expect(preX).to.equal(10);

      const recursionTx = await functionModifier.recursion();
      await recursionTx.wait();

      const curX = await functionModifier.x();
      expect(curX).to.equal(20);
    });

    it("Function : recursionWithNoReentrancy : Success", async () => {
      const preY = await functionModifier.y();
      expect(preY).to.equal(10);

      const recursionWithNoReentrancyTx =
        functionModifier.recursionWithNoReentrancy();

      expect(recursionWithNoReentrancyTx).to.revertedWith("No reentrancy");

      const curY = await functionModifier.y();
      expect(curY).to.equal(10);
    });
  });
});
