import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { converter } from "../../helpers/unit-converter";

describe("002.FirstApp", () => {
  let etherStore: Contract, attack: Contract;
  let one: SignerWithAddress, two: SignerWithAddress, three: SignerWithAddress;

  before(async () => {
    [one, two, three] = await ethers.getSigners();

    console.log("Deploying contracts with the account: " + one.address);

    const EtherStore = await ethers.getContractFactory("EtherStore001");
    etherStore = await EtherStore.deploy();
    await etherStore.deployed();

    const Attack = await ethers.getContractFactory("Attack001");
    attack = await Attack.deploy(etherStore.address);
    await attack.deployed();
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
        const preAttackBalance = await attack.getBalance();
        expect(preAttackBalance).to.equal(0);

        const attackTx = await attack.attack({
          value: converter(1, "ether", "wei"),
        });
        await attackTx.wait();

        const curAttackBalance = await attack.getBalance();
        expect(curAttackBalance).to.equal(converter(3, "ether", "wei"));
      });
    });
  });
});
