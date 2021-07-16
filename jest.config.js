module.exports = {
    collectCoverageFrom: ["**/src/js/*.js"],
    moduleNameMapper: {
        "^exports-loader.*": "<rootDir>/tests/mathQuill.js",
    },
    setupFiles: [
        "<rootDir>/tests/setupFiles.js",
        "<rootDir>/vendor/mathquill-0.10.1/mathquill.min.js",
    ],
    setupFilesAfterEnv: ["<rootDir>/tests/setupImageSnapshots.js"],
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["/node_modules/", "/vendor/"],
};
