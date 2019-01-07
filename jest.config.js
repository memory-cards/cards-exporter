module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "jest.tsconfig.json",
      diagnostics: {
        warnOnly: true
      }
    }
  },
  moduleFileExtensions: ["js", "ts", "tsx"],
  moduleNameMapper: {
    "^~/(.*)": "<rootDir>/$1"
  },
  collectCoverageFrom: [
    "<rootDir>/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/typings/**"
  ],
  setupTestFrameworkScriptFile: "<rootDir>/enzyme.js",
  silent: false,
  testEnvironment: "node",
  testRegex: "\\.(spec|test)\\.tsx?$",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  verbose: true
};
