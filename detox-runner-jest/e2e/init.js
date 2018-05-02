const detox = require('detox-runner-conformance-suite/detox');
const config = require('../package.json').detox;
const adapter = require('detox-runner-jest/adapter');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  await detox.init(config);
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});
