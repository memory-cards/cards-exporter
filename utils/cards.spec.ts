import "child_process";
import { setupCardsStorage, updateCardsStorage } from "./cards";

let execHistory: string[] = [];

jest.mock("child_process", () => ({
  exec: (command: string, cb: (_: null, result: string) => void) => {
    execHistory.push(command);
    cb(null, command);
  }
}));

describe("cardsUtils", () => {
  beforeEach(() => {
    execHistory = [];
  });
  describe("setupCardsStorage", () => {
    it("removes old and clone new dir", async () => {
      await setupCardsStorage();
      expect(execHistory).toEqual(
        expect.arrayContaining([
          "rm -rf data/cards",
          "git clone https://github.com/memory-cards/cards data/cards --depth 2"
        ])
      );
    });
  });
  describe("updateCardsStorage", () => {
    it("executes git pull", async () => {
      await updateCardsStorage();
      expect(execHistory).toEqual(
        expect.arrayContaining(["cd data/cards\ngit pull", "git log -n 1"])
      );
    });
  });
});
