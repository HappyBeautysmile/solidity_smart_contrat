import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import { converter } from "../../helpers/unit-converter";

describe("002.EtherWallet", () => {
  let etherWallet: Contract;

  let owner: SignerWithAddress, one: SignerWithAddress;

  before(async () => {
    [owner, one] = await ethers.getSigners();

    const EtherWallet = await ethers.getContractFactory("EtherWallet");
    etherWallet = await EtherWallet.deploy();
    await etherWallet.deployed();
  });

  describe("EtherWallet", async () => {
    it("Validation : variables", async () => {
      const varOwner = await etherWallet.owner();
      expect(varOwner).to.equal(owner.address);

      const balance = await etherWallet.getBalance();
      expect(balance).to.equal(0);
    });

    it("Call : Success : Send 1 ether for each", async () => {
      const preBalance = await etherWallet.getBalance();
      expect(preBalance).to.equal(0);

      const ownerSendEtherTx = await owner.sendTransaction({
        to: etherWallet.address,
        value: converter(1, "ether", "wei"),
      });
      await ownerSendEtherTx.wait();

      const oneSendEtherTx = await one.sendTransaction({
        to: etherWallet.address,
        value: converter(1, "ether", "wei"),
      });
      await oneSendEtherTx.wait();

      const curBalance = await etherWallet.getBalance();
      expect(curBalance).to.equal(converter(2, "ether", "wei"));
    });

    it("Function : withdraw : Failed : caller is not owner", async () => {
      const withdrawTx = etherWallet
        .connect(one)
        .withdraw(converter(2, "ether", "wei"));

      await expect(withdrawTx).to.revertedWith("caller is not owner");
    });

    it("Function : withdraw : Failed : over price", async () => {
      const withdrawTx = etherWallet.withdraw(converter(3, "ether", "wei"));

      await expect(withdrawTx).to.reverted;
    });

    it("Function : withdraw : Success", async () => {
      const withdrawTx = await etherWallet.withdraw(
        converter(2, "ether", "wei")
      );
      await withdrawTx.wait();

      const curBalance = await etherWallet.getBalance();
      expect(curBalance).to.equal(0);
    });
  });
});
