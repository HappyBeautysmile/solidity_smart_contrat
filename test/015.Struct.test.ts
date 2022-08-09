import { PANIC_CODES } from "@nomicfoundation/hardhat-chai-matchers/panic";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("015.Struct", () => {
  let todos: Contract;

  before(async () => {
    const Todos = await ethers.getContractFactory("Todos");
    todos = await Todos.deploy();
    await todos.deployed();
  });

  describe("Todos", () => {
    it("Function : get : Failed : Array accessed at an out-of-bounds or negative index", async () => {
      const length = await todos.length();
      expect(length).to.equal(0);

      const todo0 = todos.get(0);
      await expect(todo0).to.revertedWithPanic(
        PANIC_CODES.ARRAY_ACCESS_OUT_OF_BOUNDS
      );

      // expect(get).to.equal({ text: "", bool: false });
    });

    it("Function : transaction : create : Success", async () => {
      const createTx = await todos.create("first");
      await createTx.wait();

      const { text, completed } = await todos.get(0);
      expect(text).to.equal("first");
      expect(completed).to.equal(false);

      // other way : Access array directly (only public)
      const { text: text2, completed: completed2 } = await todos.todos(0);
      expect(text2).to.equal("first");
      expect(completed2).to.equal(false);
    });

    it("Function : transaction : updateText : Success", async () => {
      const updateTextTx = await todos.updateText(0, "updated");
      await updateTextTx.wait();

      const { text, completed } = await todos.get(0);
      expect(text).to.equal("updated");
      expect(completed).to.equal(false);
    });

    it("Function : transaction : toggleCompleted : Success", async () => {
      const toggleCompletedTx = await todos.toggleCompleted(0);
      await toggleCompletedTx.wait();

      const { text, completed } = await todos.get(0);
      expect(text).to.equal("updated");
      expect(completed).to.equal(true);
    });
  });
});
