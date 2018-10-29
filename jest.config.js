module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "jest.tsconfig.json"
    }
  },
  moduleFileExtensions: ["js", "ts", "tsx"],
  setupTestFrameworkScriptFile: "<rootDir>/enzyme.js",
  testEnvironment: "node",
  testRegex: "\\.(spec|test)\\.tsx?$",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  verbose: true
};
