"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_js_1 = __importDefault(require("next/jest.js"));
const createJestConfig = (0, jest_js_1.default)({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./"
});
// Add any custom config to be passed to Jest
const config = {
    coverageProvider: "v8",
    testEnvironment: "jsdom"
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
exports.default = createJestConfig(config);
