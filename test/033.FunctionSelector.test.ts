import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("033.FunctionSelector", () => {
  let functionSelector: Contract;

  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    const FunctionSelector = await ethers.getContractFactory(
      "FunctionSelector"
    );
    functionSelector = await FunctionSelector.deploy();
  });

  describe("FunctionSelector", async () => {
    it(`Function : getSelector : Success : "transfer(address,uint256)"`, async () => {
      const transfer = "transfer(address,uint256)";
      const transferBytes4 = "0xa9059cbb";

      const getSelector = await functionSelector.getSelector(transfer);
      expect(getSelector).to.equal(transferBytes4);
    });

    it(`Function : getSelector : Success : "transferFrom(address,address,uint256)"`, async () => {
      const transferFrom = "transferFrom(address,address,uint256)";
      const transferFromBytes4 = "0x23b872dd";

      const getSelector = await functionSelector.getSelector(transferFrom);
      expect(getSelector).to.equal(transferFromBytes4);
    });

    it(`Function : getSelector : Failed : "transfer(address, uint256)" : Spacing is not available`, async () => {
      const transferWithSpacing = "transfer(address, uint256)";
      const transferBytes4 = "0xa9059cbb";

      const getSelector = await functionSelector.getSelector(
        transferWithSpacing
      );
      expect(getSelector).to.not.equal(transferBytes4);
    });
  });
});
