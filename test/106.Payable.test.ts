import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import { converter } from "../helpers/unit-converter";

describe("106.Payable", () => {
  let payable: Contract;
  let deployer: SignerWithAddress,
    one: SignerWithAddress,
    two: SignerWithAddress;

  before(async () => {
    const Payable = await ethers.getContractFactory("Payable");
    payable = await Payable.deploy();
    await payable.deployed();

    [deployer, one, two] = await ethers.getSigners();
  });

  describe("Payable", async () => {
    it("Function : deposit : Success : payable", async () => {
      const preBalance = await payable.getBalance();
      expect(preBalance).to.equal(0);

      const depositTx = await payable.deposit({
        value: converter(1, "ether", "wei"),
      });
      await depositTx.wait();

      const curBalance = await payable.getBalance();
      expect(curBalance).to.equal(converter(1, "ether", "wei"));
    });

    it("Function : notPayable : Failed", async () => {
      try {
        const notPayableTx = await payable.notPayable({
          value: converter(1, "ether", "wei"),
        });
        await notPayableTx.wait();
      } catch ({ message }: unknown) {
        expect(message).to.equal(
          `non-payable method cannot override value (operation="overrides.value", value="1000000000000000000", code=UNSUPPORTED_OPERATION, version=contracts/5.6.2)`
        );
      }
    });

    it("Function : withdraw : Success : consider gas fee", async () => {
      const preBalance = await ethers.provider.getBalance(deployer.address);

      const withdrawTx = await payable.withdraw();
      await withdrawTx.wait();

      const curBalance = await ethers.provider.getBalance(deployer.address);

      expect(preBalance).not.to.equal(curBalance);
    });

    it("Function : transfer : Success", async () => {
      const preTwoBalance = await ethers.provider.getBalance(one.address);
      expect(preTwoBalance).to.equal(converter(10000, "ether", "wei"));

      const prePayableBalance = await payable.getBalance();
      expect(prePayableBalance).to.equal(0);

      const depositTx = await payable.deposit({
        value: converter(1, "ether", "wei"),
      });
      await depositTx.wait();

      const depositedPayableBalance = await payable.getBalance();
      expect(depositedPayableBalance).to.equal(converter(1, "ether", "wei"));

      const transferTx = await payable.transfer(
        one.address,
        converter(1, "ether", "wei")
      );
      await transferTx.wait();

      const curPayableBalance = await payable.getBalance();
      expect(curPayableBalance).to.equal(0);

      const curTwoBalance = await ethers.provider.getBalance(one.address);
      expect(curTwoBalance).to.equal(converter(10001, "ether", "wei"));
    });
  });
});
