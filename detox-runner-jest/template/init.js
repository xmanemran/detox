const detox = require('detox');
const {detoxJestAdapter} = require('detox-runner-jest');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
jasmine.getEnv().addReporter(detoxJestAdapter);

beforeAll(async () => {
  await detox.init({ some: 'config' });
});

beforeEach(async () => {
  await detoxJestAdapter.beforeEach();
});

afterAll(async () => {
  await detoxJestAdapter.afterAll();
  await detox.cleanup();
});
