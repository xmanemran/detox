const FakeDetox = require('./FakeDetox');
const testPlugin = require('./TestPlugin');
const detox = new FakeDetox().registerPlugin(testPlugin);
const DetoxJestAdapter = require('../lib/DetoxJestAdapter.js');
const jestAdapter = new DetoxJestAdapter(detox);
const timeout = 30000;

jasmine.getEnv().addReporter(jestAdapter);

beforeAll(async () => {
  await detox.init({ some: 'config' });
}, timeout);

beforeEach(async () => {
  await jestAdapter.beforeEach();
}, timeout);

afterAll(async () => {
  await jestAdapter.afterAll();
  await detox.cleanup();
}, timeout);
