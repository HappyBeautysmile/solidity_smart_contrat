import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("036.Import", () => {
  let importContract: Contract;
  let deployer: SignerWithAddress, one: SignerWithAddress;

  before(async () => {
    [deployer, one] = await ethers.getSigners();

    const ImportContract = await ethers.getContractFactory("Import");
    importContract = await ImportContract.deploy();
  });

  describe("Import", async () => {
    it(`Function : getFooName : Success`, async () => {
      const getFooName = await importContract.getFooName();
      expect(getFooName).to.equal("Foo001");
    });

    it(`Function : getPoint : Success`, async () => {
      const { x, y } = await importContract.getPoint(1, 2);
      expect(x).to.equal(1);
      expect(y).to.equal(2);
    });

    it(`Function : isOwner : Success`, async () => {
      const isOwner = await importContract.isOwner();
      expect(isOwner).to.equal(true);
    });

    it(`Function : isOwner : Failed : if not owner`, async () => {
      const isOwner = importContract.connect(one).isOwner();
      await expect(isOwner)
        .to.revertedWithCustomError(importContract, "Unauthorized")
        .withArgs(one.address);
    });

    it(`Function : addNum : Success`, async () => {
      const addNum = await importContract.addNum(1, 2);
      expect(addNum).to.equal(3);
    });
  });
});
