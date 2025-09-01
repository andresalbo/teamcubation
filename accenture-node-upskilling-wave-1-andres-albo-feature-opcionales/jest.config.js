export default {
  preset: "ts-jest",
  testEnvironment: "node", // Si usas React, cambia a "jsdom"
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/__tests__/**/*.test.ts"],
};
