import * as childProcess from "child_process";
import * as util from "util";

const exec = util.promisify(childProcess.exec);

export const setupCardsStorage = () =>
  Promise.resolve()
    .then(() => exec("rm -rf data/cards"))
    .then(() =>
      exec(
        "git clone https://github.com/memory-cards/cards data/cards --depth 2"
      )
    );

export const updateCardsStorage = () =>
  Promise.resolve()
    .then(() =>
      exec(`
        cd data/cards
        git pull
        `)
    )
    .then(() => exec("git log -n 1"))
    .then(data => data.stdout);
