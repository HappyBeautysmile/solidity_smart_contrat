import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("025.CallingParentContracts", () => {
  let aa: Contract, bb: Contract, cc: Contract, dd: Contract;

  before(async () => {
    const AA = await ethers.getContractFactory("AA");
    aa = await AA.deploy();
    await aa.deployed();

    const BB = await ethers.getContractFactory("BB");
    bb = await BB.deploy();
    await bb.deployed();

    const CC = await ethers.getContractFactory("CC");
    cc = await CC.deploy();
    await cc.deployed();

    const DD = await ethers.getContractFactory("DD");
    dd = await DD.deploy();
    await dd.deployed();
  });

  describe("Validations", () => {
    describe("AA", async () => {
      it("Function : foo : emit : AA", async () => {
        const foo = aa.foo();
        await expect(foo).to.emit(aa, "Log").withArgs("AA.foo called");
      });

      it("Function : foo : emit : AA", async () => {
        const bar = aa.bar();
        await expect(bar).to.emit(aa, "Log").withArgs("AA.bar called");
      });
    });

    describe("BB", async () => {
      it("Function : foo : emit : BB, AA", async () => {
        const foo = bb.foo();
        await expect(foo).to.emit(bb, "Log").withArgs("BB.foo called");
        await expect(foo).to.emit(bb, "Log").withArgs("AA.foo called");
      });

      it("Function : foo : emit : BB, AA", async () => {
        const bar = bb.bar();
        await expect(bar).to.emit(bb, "Log").withArgs("BB.bar called");
        await expect(bar).to.emit(bb, "Log").withArgs("AA.bar called");
      });
    });

    describe("CC", async () => {
      it("Function : foo : emit : CC, AA", async () => {
        const foo = cc.foo();
        await expect(foo).to.emit(cc, "Log").withArgs("CC.foo called");
        await expect(foo).to.emit(cc, "Log").withArgs("AA.foo called");
      });

      it("Function : foo : emit : CC, AA", async () => {
        const bar = cc.bar();
        await expect(bar).to.emit(cc, "Log").withArgs("CC.bar called");
        await expect(bar).to.emit(cc, "Log").withArgs("AA.bar called");
      });
    });

    describe("DD", async () => {
      it("Function : foo : emit : CC, AA", async () => {
        const foo = dd.foo();
        await expect(foo).to.emit(dd, "Log").withArgs("CC.foo called");
        await expect(foo).to.emit(dd, "Log").withArgs("AA.foo called");
      });

      it("Function : foo : emit : CC, AA", async () => {
        const bar = dd.bar();
        await expect(bar).to.emit(dd, "Log").withArgs("CC.bar called");
        await expect(bar).to.emit(dd, "Log").withArgs("AA.bar called");
      });
    });
  });
});
