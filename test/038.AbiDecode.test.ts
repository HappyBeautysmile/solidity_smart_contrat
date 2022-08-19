import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("038.AbiDecode", () => {
  let abiDecode: Contract;
  let deployer: SignerWithAddress;
  let x: number,
    addr: string,
    myStruct: { sender: string; nums: number[] },
    data: any;
  before(async () => {
    [deployer] = await ethers.getSigners();

    const AbiDecode = await ethers.getContractFactory("AbiDecode");
    abiDecode = await AbiDecode.deploy();
    await abiDecode.deployed();

    x = 1;
    addr = deployer.address;
    myStruct = { sender: deployer.address, nums: [1, 2] };
  });

  describe("AbiDecode", async () => {
    it(`Function : encode : Success`, async () => {
      data = await abiDecode.encode(x, addr, myStruct);
    });

    it(`Function : decode : Success`, async () => {
      const { x_, addr_, myStruct_ } = await abiDecode.decode(data);
      expect(x_).to.equal(x);
      expect(addr_).to.equal(addr);
      expect(myStruct_.sender).to.equal(myStruct.sender);
      expect(myStruct_.nums.map((ele: any) => Number(ele))).to.deep.equal(
        myStruct.nums
      );
    });
  });
});
