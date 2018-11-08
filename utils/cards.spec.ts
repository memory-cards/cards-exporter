import "child_process";
import "fs";
import { setupCardsStorage, updateCardsStorage } from "./cards";
import { getRemoveCommand } from "./env";

let execHistory: string[] = [];
let mockCardsExists = true;

jest.mock("child_process", () => ({
  exec: (command: string, cb: (_: null, result: string) => void) => {
    execHistory.push(command);
    cb(null, command);
  }
}));

jest.mock("fs", () => ({
  stat: (_: string, cb: (err: any, result: any) => void) =>
    cb(null, mockCardsExists)
}));

describe("cardsUtils", () => {
  beforeEach(() => {
    execHistory = [];
  });
  describe("setupCardsStorage", () => {
    describe("forceRenew: true", () => {
      it("removes old and clone new dir on force renew", async () => {
        mockCardsExists = true;
        await setupCardsStorage(true);
        expect(execHistory).toEqual(
          expect.arrayContaining([
            getRemoveCommand("data/cards"),
            "git clone https://github.com/memory-cards/cards data/cards --depth 2"
          ])
        );
      });
      it("does not remove old and clone new dir on force renew", async () => {
        mockCardsExists = false;
        await setupCardsStorage(true);
        expect(execHistory).toEqual(
          expect.arrayContaining([
            "git clone https://github.com/memory-cards/cards data/cards --depth 2"
          ])
        );
      });
    });
    describe("forceRenew: false", () => {
      it("does nothing on existing data/cards", async () => {
        mockCardsExists = true;
        await setupCardsStorage();
        expect(execHistory).toEqual([]);
      });
      it("just clones repo on non-existing data/cards", async () => {
        mockCardsExists = false;
        await setupCardsStorage();
        expect(execHistory).toEqual([
          "git clone https://github.com/memory-cards/cards data/cards --depth 2"
        ]);
      });
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
