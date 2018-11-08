import * as path from "path";

export const isWin = process.platform.startsWith("win");

// in *nix `rm` by default skip non-existing files,
// on win* we have to use another command and check if directory exists
export const rmCommand = (pathToRemove: string) =>
  isWin
    ? `if exist "${path}" rmdir /s /q "${pathToRemove
        .split("/")
        .join(path.sep)}"`
    : `rm -rf "${pathToRemove}"`;
