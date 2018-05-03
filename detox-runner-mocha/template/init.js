const detox = require('detox');
const config = require('../package.json').detox;
const adapter = require('detox-runner-mocha/adapter');

before(async () => {
  await detox.init(config);
});

beforeEach(async function () {
  await adapter.beforeEach(this);
});

afterEach(async function () {
  console.log('global.afterEach');
  await adapter.afterEach(this);
});

after(async () => {
  console.log('global.after');
  await detox.cleanup();
});
