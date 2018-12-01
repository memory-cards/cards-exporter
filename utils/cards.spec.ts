import "child_process";
import "fs";
import * as glob from "glob";

import {
  getAllCards,
  getCardData,
  isCardTypeExists,
  setupCardsStorage,
  updateCardsStorage
} from "./cards";
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
  readFile: (fileName: string, cb: (err: any, result: any) => void) =>
    cb(null, {
      toString: () => `{ type: "${fileName}" }`
    }),
  stat: (_: string, cb: (err: any, result: any) => void) =>
    cb(null, mockCardsExists)
}));

jest.mock(
  "card-types/types/some_type",
  () => obj => ({
    processed: obj
  }),
  { virtual: true }
);

jest.mock("glob", () => ({
  Glob: (pattern: string, cb: (_: null, data: string[]) => void) =>
    cb(null, [
      `${pattern} - data/cards/1.json`,
      `${pattern} - data/cards/2.json`
    ])
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

  describe("isCardTypeExists", () => {
    it("returns false for non-existing module", () =>
      expect(isCardTypeExists("some unknown module")).toEqual(false));

    it("returns true for existing module", () =>
      expect(isCardTypeExists("some_type")).toEqual(true));
  });

  describe("getCardData", () => {
    it("should call processor and return result", () =>
      expect(
        getCardData({
          type: "some_type"
        })
      ).toMatchObject({
        processed: {
          type: "some_type"
        }
      }));
  });

  describe("getAllCards", () => {
    it("should return info about all cards by pattern", async () => {
      const cards = await getAllCards();
      expect(cards).toMatchObject([
        {
          type: "data/cards/*/*.json* - data/cards/1.json"
        },
        {
          type: "data/cards/*/*.json* - data/cards/2.json"
        }
      ]);
    });
  });
});
