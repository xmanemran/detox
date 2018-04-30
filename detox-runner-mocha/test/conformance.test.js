const assert = require('detox-runner-conformance-suite/assert');
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

describe('fake detox + jest + test plugin integration', () => {
  it('ok sync', () => {
    testPlugin.assertCounter(8);
    testPlugin.assertCounter(9);
  });

  xit('pending static', async () => {
    testPlugin.assertCounter(8);
    await sleep();
    testPlugin.assertCounter(9);
  });

  it('fail sync', () => {
    testPlugin.assertCounter(8);
    testPlugin.assertCounter(9);
    fail('some reason');
  });

  it('ok async', async () => {
    testPlugin.assertCounter(8);
    await sleep();
    testPlugin.assertCounter(9);
  });

  it('fail due to dynamic pending', async () => {
    testPlugin.assertCounter(8);
    testPlugin.assertCounter(9);
    pending('some reason');
  });

  it('fail async', async () => {
    testPlugin.assertCounter(8);
    await sleep();
    testPlugin.assertCounter(9);

    fail('other reason');
  });

  it('fail by timeout', async () => {
    testPlugin.assertCounter(8);
    await sleep();
    testPlugin.assertCounter(9);
    await sleep();
  }, sleep.defaultMs * 1.5);
});
