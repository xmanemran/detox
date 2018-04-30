const testPlugin = require('./TestPlugin');
const sleep = require('./sleep');

beforeAll(async () => {
  testPlugin.assertCounter(2);
  await sleep();
  testPlugin.assertCounter(3);
});

beforeEach(async () => {
  testPlugin.assertCounter(6);
  await sleep();
  testPlugin.assertCounter(7);
});

afterEach(async () => {
  testPlugin.assertCounter(10);
  await sleep();
  testPlugin.assertCounter(11);
});

afterAll(async () => {
  testPlugin.assertCounter(14);
  await sleep();
  testPlugin.assertCounter(15);
});

it('ok 1', async () => {
  testPlugin.assertCounter(8);
  await sleep();
  testPlugin.assertCounter(9);
});

it('ok 2', async () => {
  testPlugin.assertCounter(8);
  await sleep();
  testPlugin.assertCounter(9);
});

it('fail 1', async () => {
  testPlugin.assertCounter(8);
  await sleep();
  testPlugin.assertCounter(9);
  jest.fail(); // TODO:
});

it('fail 2', async () => {
  testPlugin.assertCounter(8);
  await sleep();
  testPlugin.assertCounter(9);
  jest.fail(); // TODO:
});
