import * as env from "./env";

// using `process.platform = 'linux'` won't affect
// https://stackoverflow.com/a/30405547/3400830
const setPlatform = (platformName: any) =>
  Object.defineProperty(process, "platform", {
    value: platformName
  });

describe("env", () => {
  let platform: any;
  beforeEach(() => {
    platform = process.platform;
  });
  afterEach(() => setPlatform(platform));

  describe("getIsWindows", () => {
    it("recognizes not windows", () => {
      setPlatform("linux");
      expect(env.getIsWindows()).toBeFalsy();
    });
    it("recognizes windows", () => {
      setPlatform("win32");
      expect(env.getIsWindows()).toBeTruthy();
    });
  });

  describe("getRemoveCommand", () => {
    const pathToRemove = "path/to/remove";

    it("should return correct command for *nix", () => {
      setPlatform("linux");
      expect(env.getRemoveCommand(pathToRemove)).toBe(
        'rm -rf "path/to/remove"'
      );
    });

    it("should return correct command for *windows", () => {
      setPlatform("win32");
      expect(env.getRemoveCommand(pathToRemove)).toBe(
        'if exist "path\\to\\remove" rmdir /s /q "path\\to\\remove"'
      );
    });
  });
});
