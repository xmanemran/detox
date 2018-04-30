const firstTestContent = require('./firstTestContent');
const runnerConfig = `{
    "setupTestFrameworkScriptFile": "./init.js"
}`;

const initjsContent = `const detox = require('detox');
const config = require('../package.json').detox;
const detoxJestAdapter = require('detox/src/runners/jest/adapter');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
jasmine.getEnv().addReporter(detoxJestAdapter);

beforeAll(async () => {
    await detox.init(config);
});

beforeEach(async () => {
    await detoxJestAdapter.beforeEach();
});

afterAll(async () => {
    await detoxJestAdapter.afterAll();
    await detox.cleanup();
});`;

exports.initjs = initjsContent;
exports.firstTest = firstTestContent;
exports.runnerConfig = runnerConfig;
