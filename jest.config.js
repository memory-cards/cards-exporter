module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "jest.tsconfig.json"
    }
  },
  moduleFileExtensions: ["js", "ts", "tsx"],
  moduleNameMapper: {
    "^~/(.*)": "<rootDir>/$1"
  },
  setupTestFrameworkScriptFile: "<rootDir>/enzyme.js",
  silent: false,
  testEnvironment: "node",
  testRegex: "\\.(spec|test)\\.tsx?$",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  verbose: false
};
