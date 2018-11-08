import * as childProcess from "child_process";
import * as fs from "fs";
import * as util from "util";
import { rmCommand } from "./env";

const exec = util.promisify(childProcess.exec);
const stat = util.promisify(fs.stat);

export const setupCardsStorage = async (forceRenew = false) => {
  const cardsDirExists = await stat("data/cards").catch(_ => false);
  if (forceRenew && cardsDirExists) {
    await exec(rmCommand("data/cards"));
  }
  if (forceRenew || !cardsDirExists) {
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
