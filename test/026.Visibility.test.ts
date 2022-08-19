import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("026.Visibility", () => {
  let base: Contract, child: Contract;

  before(async () => {
    const Base = await ethers.getContractFactory("Base");
    base = await Base.deploy();
    await base.deployed();

    const Child = await ethers.getContractFactory("Child");
    child = await Child.deploy();
    await child.deployed();
  });

  describe("Validations", () => {
    describe("Base", async () => {
      describe("Variables", async () => {
        it("Variable : call : publicVar : Success", async () => {
          const publicVar = await base.publicVar();
          expect(publicVar).to.equal("my public variable");
        });

        it("Variable : call : externalVar : Skip : external is not available", async () => {});

        it("Variable : call : internalVar : Failed : not visible variable", async () => {
          try {
            const internalVar = await base.internalVar();
            await internalVar.wait();
          } catch ({ message }: unknown) {
            expect(message).to.equal("base.internalVar is not a function");
          }
        });

        it("Variable : call : privateVar : Failed : not visible variable", async () => {
          try {
            const privateVar = await base.privateVar();
            await privateVar.wait();
          } catch ({ message }: unknown) {
            expect(message).to.equal("base.privateVar is not a function");
          }
        });
      });

      describe("Functions", async () => {
        it("Function : call : publicFunc : Success", async () => {
          const publicFunc = await base.publicFunc();
          expect(publicFunc).to.equal("public function called");
        });

        it("Function : call : externalFunc : Success", async () => {
          const externalFunc = await base.externalFunc();
          expect(externalFunc).to.equal("external function called");
        });

        it("Function : call : internalFunc : Failed : not visible function", async () => {
          try {
            const internalFunc = await base.internalFunc();
            await internalFunc.wait();
          } catch ({ message }: unknown) {
            expect(message).to.equal("base.internalFunc is not a function");
          }
        });

        it("Function : call : testInternalFunc : Success", async () => {
          const testInternalFunc = await base.testInternalFunc();
          expect(testInternalFunc).to.equal("internal function called");
        });

        it("Function : call : privateFunc : Failed : not visible function", async () => {
          try {
            const privateFunc = await base.privateFunc();
            await privateFunc.wait();
          } catch ({ message }: unknown) {
            expect(message).to.equal("base.privateFunc is not a function");
          }
        });

        it("Function : call : testPrivateFunc : Success", async () => {
          const testPrivateFunc = await base.testPrivateFunc();
          expect(testPrivateFunc).to.equal("private function called");
        });
      });
    });

    describe("Child", async () => {
      describe("Variables", async () => {
        it("Variable : call : parent.publicBar : Success", async () => {
          const publicVar = await child.publicVar();
          expect(publicVar).to.equal("my public variable");
        });
      });

      describe("Functions", async () => {
        it("Function : call : parent.publicFunc : Success", async () => {
          const publicFunc = await child.publicFunc();
          expect(publicFunc).to.equal("public function called");
        });

        it("Function : call : parent.externalFunc : Success", async () => {
          const externalFunc = await child.externalFunc();
          expect(externalFunc).to.equal("external function called");
        });

        it("Function : call : parent.testInternalFunc : Success", async () => {
          const testInternalFunc = await child.testInternalFunc();
          expect(testInternalFunc).to.equal("internal function called");
        });

        it("Function : call : parent.testPrivateFunc : Success", async () => {
          const testPrivateFunc = await child.testPrivateFunc();
          expect(testPrivateFunc).to.equal("private function called");
        });
      });
    });
  });
});
