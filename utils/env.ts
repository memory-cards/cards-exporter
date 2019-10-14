export const getIsWindows = () => process.platform.startsWith("win");

// in *nix `rm` by default skip non-existing files,
// on win* we have to use another command and check if directory exists
export const getRemoveCommand = (pathToRemove: string) => {
  const isWin = getIsWindows();

  // technically we could use path.sep
  // this one done for test purposes
  const PATH_SEPARATOR = isWin ? "\\" : "/";

  const winPathToRemove = pathToRemove.split("/").join(PATH_SEPARATOR);
  return isWin
    ? `if exist "${winPathToRemove}" rmdir /s /q "${winPathToRemove}"`
    : `rm -rf "${pathToRemove}"`;
};

export const showMemory = () => {
  const used = process.memoryUsage() as any;
  // tslint:disable
  for (const key in used) {
    console.log(
      `listCards${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
};
