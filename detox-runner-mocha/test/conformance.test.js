const { assert, sleep } = require('detox-runner-conformance-suite');

describe('fake detox + mocha + test plugin integration', () => {
  before(async () => {
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
    console.log('test.afterEach');
    assert.state.AFTER_EACH_BEGIN();
    await sleep();
    assert.state.AFTER_EACH_END();
  });

  after(async () => {
    console.log('test.after');
    assert.state.AFTER_ALL_BEGIN();
    await sleep();
    assert.state.AFTER_ALL_END();
  });

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

  // it('fail due to dynamic pending', async () => {
  //   assert.state.TEST_BEGIN();
  //   assert.state.TEST_END();
  //   pending('some reason');
  // });

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
