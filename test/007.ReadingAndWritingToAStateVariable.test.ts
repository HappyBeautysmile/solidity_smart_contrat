import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("007.ReadingAndWritingToAStateVariable", () => {
  let simpleStorage: Contract;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.deployed();
  });

  describe("SimpleStorage", async () => {
    it(`Function : get : Success`, async () => {
      const get = await simpleStorage.get(); // use function
      const num = await simpleStorage.num(); // call public variable
      expect(0).to.equal(get).and.to.equal(num);
    });

    it(`Function : transaction : set : Success`, async () => {
      const setTx = await simpleStorage.set(100);
      await setTx.wait();
    });

    it(`Function : get : after set : Success`, async () => {
      const get = await simpleStorage.get(); // use function
      const num = await simpleStorage.num(); // call public variable
      expect(100).to.equal(get).and.to.equal(num);
    });
  });
});
