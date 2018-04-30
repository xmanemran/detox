const detox = require('detox');
const {detoxJestAdapter} = require('detox-runner-jest');
const timeout = 30000;

jasmine.getEnv().addReporter(detoxJestAdapter);

beforeAll(async () => {
  await detox.init({ some: 'config' });
}, timeout);

beforeEach(async () => {
  await detoxJestAdapter.beforeEach();
}, timeout);

afterAll(async () => {
  await detoxJestAdapter.afterAll();
  await detox.cleanup();
}, timeout);
