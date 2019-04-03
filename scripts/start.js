const childProcess = require("child_process");
const fs = require("fs");
const execSync = str => childProcess.execSync(str, { stdio: "inherit" });

execSync("yarn run postinstall");
execSync("yarn start:build");
execSync("yarn start:server");
