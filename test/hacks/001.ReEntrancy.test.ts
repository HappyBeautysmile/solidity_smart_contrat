import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { converter } from "../../helpers/unit-converter";

describe("001.Reentrancy", () => {
  let etherStore: Contract,
    attack1: Contract,
    safeEtherStore: Contract,
    attack2: Contract;
  let one: SignerWithAddress, two: SignerWithAddress, three: SignerWithAddress;

  before(async () => {
    [one, two, three] = await ethers.getSigners();

    console.log("Deploying contracts with the account: " + one.address);

    const EtherStore = await ethers.getContractFactory("EtherStore001");
    etherStore = await EtherStore.deploy();
    await etherStore.deployed();

    const Attack1 = await ethers.getContractFactory("Attack001");
    attack1 = await Attack1.deploy(etherStore.address);
    await attack1.deployed();

    const SafeEtherStore = await ethers.getContractFactory("SafeEtherStore001");
    safeEtherStore = await SafeEtherStore.deploy();
    await safeEtherStore.deployed();

    const Attack2 = await ethers.getContractFactory("Attack002");
    attack2 = await Attack2.deploy(safeEtherStore.address);
    await attack2.deployed();
  });

  describe("Validations", () => {
    describe("EtherStore001", async () => {
      it("EtherStore001 : function : deposit : success", async () => {
        const depositTx2 = await etherStore.connect(two).deposit({
          value: converter(1, "ether", "wei"),
        });
        await depositTx2.wait();

        const depositTx3 = await etherStore
          .connect(three)
          .deposit({ value: converter(1, "ether", "wei") });
        await depositTx3.wait();

        const balance = await etherStore.getBalance();
        expect(balance).to.equal(converter(2, "ether", "wei"));
      });

      it("EtherStore001 : function : withdraw : success", async () => {
        const pre2Balance = await two.getBalance();
        const pre3Balance = await three.getBalance();

        const withdraw2Tx = await etherStore.connect(two).withdraw();
        await withdraw2Tx.wait();

        const cur2Balance = await two.getBalance();
        expect(pre2Balance).not.to.equal(cur2Balance);
        console.log("pre2Balance :>> ", pre2Balance);
        console.log("cur2Balance", cur2Balance);

        const withdraw3Tx = await etherStore.connect(three).withdraw();
        await withdraw3Tx.wait();

        const cur3Balance = await two.getBalance();
        expect(pre3Balance).not.to.equal(cur3Balance);
        console.log("pre3Balance :>> ", pre3Balance);
        console.log("cur3Balance", cur3Balance);
      });

      it("EtherStore001 : function : withdraw : fail : no balance", async () => {
        const withdraw2Tx = etherStore.connect(two).withdraw();
        await expect(withdraw2Tx).to.revertedWith("No balance");

        const withdraw3Tx = etherStore.connect(three).withdraw();
        await expect(withdraw3Tx).to.revertedWith("No balance");
      });
    });

    describe("Attack001", async () => {
      it("EtherStore001 : function : deposit : success", async () => {
        const depositTx2 = await etherStore.connect(two).deposit({
          value: converter(1, "ether", "wei"),
        });
        await depositTx2.wait();

        const depositTx3 = await etherStore
          .connect(three)
          .deposit({ value: converter(1, "ether", "wei") });
        await depositTx3.wait();

        const balance = await etherStore.getBalance();
        expect(balance).to.equal(converter(2, "ether", "wei"));
      });

      it("Attack001 : function : attack : success", async () => {
        const preAttackBalance = await attack1.getBalance();
        expect(preAttackBalance).to.equal(0);

        const attack1Tx = await attack1.attack({
          value: converter(1, "ether", "wei"),
        });
        await attack1Tx.wait();

        const curAttackBalance = await attack1.getBalance();
        expect(curAttackBalance).to.equal(converter(3, "ether", "wei"));
      });
    });

    describe("SafeEtherStore001", async () => {
      it("SafeEtherStore001 : function : deposit : success", async () => {
        const depositTx2 = await safeEtherStore.connect(two).deposit({
          value: converter(1, "ether", "wei"),
        });
        await depositTx2.wait();

        const depositTx3 = await safeEtherStore
          .connect(three)
          .deposit({ value: converter(1, "ether", "wei") });
        await depositTx3.wait();

        const balance = await safeEtherStore.getBalance();
        expect(balance).to.equal(converter(2, "ether", "wei"));
      });

      it("Attack002 : function : attack : fail : lock", async () => {
        const safeEtherStoreAddress = await attack2.safeEtherStore();
        expect(safeEtherStoreAddress).to.equal(safeEtherStore.address);

        const preAttackBalance = await attack2.getBalance();
        expect(preAttackBalance).to.equal(0);

        const preStoreBalance = await safeEtherStore.getBalance();
        expect(preStoreBalance).to.equal(converter(2, "ether", "wei"));

        const attack2Tx = await attack2.attack({
          value: converter(1, "ether", "wei"),
        });
        await attack2Tx.wait();

        const curAttackBalance = await attack2.getBalance();
        expect(curAttackBalance).to.equal(0);

        const curStoreBalance = await safeEtherStore.getBalance();
        expect(curStoreBalance).to.equal(converter(3, "ether", "wei"));
      });
    });
  });
});
