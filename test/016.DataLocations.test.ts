import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("016.DataLocations", () => {
  let dataLocations: Contract;

  before(async () => {
    const DataLocations = await ethers.getContractFactory("DataLocations");
    dataLocations = await DataLocations.deploy();
    await dataLocations.deployed();
  });

  describe("DataLocations", () => {
    it("Function : f : Success", async () => {
      const fTx = await dataLocations.f();
      await fTx.wait();
    });

    it("Function : g : Success", async () => {
      const gTx = await dataLocations.g([]);
      await gTx.wait();
    });

    it("Function : h : Success", async () => {
      const hTx = await dataLocations.h([]);
      await hTx.wait();
    });
  });
});
