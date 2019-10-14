import * as childProcess from "child_process";
import * as fs from "fs";
import * as glob from "glob";
import * as json5 from "json5";
import * as util from "util";
import { ICardDefinition } from "~/typings/ICardDefinition";
import { getRemoveCommand } from "./env";

const globPromised = util.promisify(glob.Glob);
const readFilePromised = util.promisify(fs.readFile);
const exec = util.promisify(childProcess.exec);
const stat = util.promisify(fs.stat);

export const setupCardsStorage = async (isForceRenew = false) => {
  const cardsDirExists = await stat("data/cards").catch(_ => false);
  if (isForceRenew && cardsDirExists) {
    await exec(getRemoveCommand("data/cards"));
  }
  if (isForceRenew || !cardsDirExists) {
    await exec(
      "git clone https://github.com/memory-cards/cards data/cards --depth 2"
    );
  }
};

export const updateCardsStorage = () =>
  Promise.resolve()
    .then(() => exec(["cd data/cards", "git pull"].join("\n")))
    .then(() => exec("git log -n 1"))
    .then(data => data.stdout);

export const isCardTypeExists = (() => {
  const memory: {
    [key: string]: boolean;
  } = {};
  return (cardType: string) => {
    if (cardType in memory) {
      return memory[cardType];
    }
    try {
      require(`card-types/types/${cardType}`);
      memory[cardType] = true;
    } catch (e) {
      memory[cardType] = false;
    }
    return memory[cardType];
  };
})();

export const getCardData: (cardConfig: {
  type: string;
}) => {
  front: string;
  back: string;
  tags: string[];
} = cardConfig => {
  const processor = require(`card-types/types/${cardConfig.type}`);
  return processor(cardConfig);
};

export const getAllCards = (): Promise<ICardDefinition[]> =>
  globPromised("data/cards/**/*.json*", {
    ignore: "data/cards/package.json"
  }).then((files: string[]) =>
    Promise.all(
      files.map(fileName =>
        readFilePromised(fileName).then(item => json5.parse(item.toString()))
      )
    )
  );

export const filterKnownCards = (list: ICardDefinition[]): ICardDefinition[] =>
  list.filter(el => isCardTypeExists(el.type));

export const filterCardsByTags = (cards: ICardDefinition[], tags: string[]) =>
  tags.length
    ? cards.filter(card =>
        card.tags.some(tag => tags.some(userTag => userTag === tag))
      )
    : cards;
