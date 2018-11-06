import * as childProcess from "child_process";
import * as util from "util";

const isWin = process.platform.includes("win") && process.platform !== "darwin";
const exec = util.promisify(childProcess.exec);

// in *nix `rm` by default skip non-existing files,
// on win* we have to use another command and check if directory exists
const rmCommand = isWin
  ? `if exist "data\\cards" rmdir /s /q "data\\cards"`
  : "rm -rf data/cards";

export const setupCardsStorage = () =>
  Promise.resolve()
    .then(() => exec(rmCommand))
    .then(() =>
      exec(
        "git clone https://github.com/memory-cards/cards data/cards --depth 2"
      )
    );

export const updateCardsStorage = () =>
  Promise.resolve()
    .then(() => exec(["cd data/cards", "git pull"].join("\n")))
    .then(() => exec("git log -n 1"))
    .then(data => data.stdout);
