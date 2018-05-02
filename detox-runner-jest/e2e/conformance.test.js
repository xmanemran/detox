const { assert, sleep } = require('detox-runner-conformance-suite');

beforeAll(async () => {
  assert.state.BEFORE_ALL_BEGIN();
  await sleep();
  assert.state.BEFORE_ALL_END();
});

beforeEach(async () => {
  assert.state.BEFORE_EACH_BEGIN();
  await sleep();
  assert.state.BEFORE_EACH_END();
});

afterEach(async () => {
  assert.state.AFTER_EACH_BEGIN();
  await sleep();
  assert.state.AFTER_EACH_END();
});

afterAll(async () => {
  assert.state.AFTER_ALL_BEGIN();
  await sleep();
  assert.state.AFTER_ALL_END();
});

describe('fake detox + jest + test plugin integration', () => {
  it('ok sync', () => {
    assert.state.TEST_BEGIN();
    assert.state.TEST_END();
  });

  xit('pending static', async () => {
    assert.state.TEST_BEGIN();
    await sleep();
    assert.state.TEST_END();
  });

  it('fail sync', () => {
    assert.state.TEST_BEGIN();
    assert.state.TEST_END();
    fail('some reason');
  });

  it('ok async', async () => {
    assert.state.TEST_BEGIN();
    await sleep();
    assert.state.TEST_END();
  });

  it('fail due to dynamic pending', async () => {
    assert.state.TEST_BEGIN();
    assert.state.TEST_END();
    pending('some reason');
  });

  it('fail async', async () => {
    assert.state.TEST_BEGIN();
    await sleep();
    assert.state.TEST_END();

    fail('other reason');
  });

  it('fail by timeout', async () => {
    assert.state.TEST_BEGIN();
    await sleep();
    assert.state.TEST_END();
    await sleep();
  }, sleep.defaultMs * 1.5);
});
