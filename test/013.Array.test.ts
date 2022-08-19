import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("013.Array", () => {
  let arrayRemoveByShifting: Contract, arrayReplaceFromEnd: Contract;
  let deployer: SignerWithAddress,
    one: SignerWithAddress,
    two: SignerWithAddress;

  before(async () => {
    [deployer, one, two] = await ethers.getSigners();

    const ArrayRemoveByShifting = await ethers.getContractFactory(
      "ArrayRemoveByShifting"
    );
    arrayRemoveByShifting = await ArrayRemoveByShifting.deploy();
    await arrayRemoveByShifting.deployed();

    const ArrayReplaceFromEnd = await ethers.getContractFactory(
      "ArrayReplaceFromEnd"
    );
    arrayReplaceFromEnd = await ArrayReplaceFromEnd.deploy();
    await arrayReplaceFromEnd.deployed();
  });

  describe("ArrayRemoveByShifting", async () => {
    it("Validation : value", async () => {
      const getArr = await arrayRemoveByShifting.getArr();
      expect(getArr).to.deep.equal([1, 2, 3, 4, 5]);
      expect(getArr.length).to.equal(5);
    });

    it(`Function : transaction : remove : index 2 : Success`, async () => {
      const removeTx = await arrayRemoveByShifting.remove(2);
      await removeTx.wait();

      const getArr = await arrayRemoveByShifting.getArr();
      expect(getArr).to.deep.equal([1, 2, 4, 5]);
      expect(getArr.length).to.equal(4);
    });

    it(`Function : transaction : remove : index 5 : Failed : index out of bound`, async () => {
      const removeTx = arrayRemoveByShifting.remove(5);
      await expect(removeTx).to.revertedWith("index out of bound");
    });

    it(`Function : transaction : remove : index 1 : Success`, async () => {
      const removeTx = await arrayRemoveByShifting.remove(1);
      await removeTx.wait();

      const getArr = await arrayRemoveByShifting.getArr();
      expect(getArr).to.deep.equal([1, 4, 5]);
      expect(getArr.length).to.equal(3);
    });

    it(`Function : transaction : remove : index 0 : Success`, async () => {
      const removeTx = await arrayRemoveByShifting.remove(0);
      await removeTx.wait();

      const getArr = await arrayRemoveByShifting.getArr();
      expect(getArr).to.deep.equal([4, 5]);
      expect(getArr.length).to.equal(2);
    });
  });

  describe("ArrayReplaceFromEnd", async () => {
    it("Validation : value", async () => {
      const getArr = await arrayReplaceFromEnd.getArr();
      expect(getArr).to.deep.equal([1, 2, 3, 4, 5]);
      expect(getArr.length).to.equal(5);
    });

    it(`Function : transaction : remove : index 2 : Success`, async () => {
      const removeTx = await arrayReplaceFromEnd.remove(2);
      await removeTx.wait();

      const getArr = await arrayReplaceFromEnd.getArr();
      expect(getArr).to.deep.equal([1, 2, 5, 4]);
      expect(getArr.length).to.equal(4);
    });

    it(`Function : transaction : remove : index 5 : Failed : index out of bound`, async () => {
      const removeTx = arrayReplaceFromEnd.remove(5);
      await expect(removeTx).to.revertedWith("index out of bound");
    });

    it(`Function : transaction : remove : index 1 : Success`, async () => {
      const removeTx = await arrayReplaceFromEnd.remove(1);
      await removeTx.wait();

      const getArr = await arrayReplaceFromEnd.getArr();
      expect(getArr).to.deep.equal([1, 4, 5]);
      expect(getArr.length).to.equal(3);
    });

    it(`Function : transaction : remove : index 0 : Success`, async () => {
      const removeTx = await arrayReplaceFromEnd.remove(0);
      await removeTx.wait();

      const getArr = await arrayReplaceFromEnd.getArr();
      expect(getArr).to.deep.equal([5, 4]);
      expect(getArr.length).to.equal(2);
    });
  });
});
