export default {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules",
    "<rootDir>/functions/node_modules",
  ],
  testMatch: ["<rootDir>/**/*.test.ts"],
  globals: { "ts-jest": { diagnostics: false } },
};
