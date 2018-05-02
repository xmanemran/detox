const sleep = require('./sleep');
const assert = require('./assert');

class TestPlugin {
  async onStart() {
    assert.state.ON_START_BEGIN();
    await sleep();
    assert.state.ON_START_END();
  }

  async beforeTest(spec) {
    TestPlugin.assertSpecIsReadonly(spec);
    TestPlugin.assertTitleIsString(spec);
    TestPlugin.assertFullnameIsString(spec);
    TestPlugin.assertStatus(spec, 'running');

    assert.state.BEFORE_TEST_BEGIN();
    await sleep();
    assert.state.BEFORE_TEST_END();
  }

  async afterTest(spec) {
    TestPlugin.assertStatus(spec, TestPlugin.getExpectedStatus(spec));

    assert.state.AFTER_TEST_BEGIN();
    await sleep();
    assert.state.AFTER_TEST_END();
  }

  async onExit() {
    assert.state.ON_EXIT_BEGIN();
    await sleep();
    assert.state.ON_EXIT_END();
  }

  static assertSpecIsReadonly(spec) {
    let readonly = false;
    try {
      spec[Math.random()] = 1;
    } catch (e) {
      readonly = true;
    }

    if (!readonly) {
      throw new Error('spec object should be read-only');
    }
  }

  static assertTitleIsString(spec) {
    if (typeof spec.title !== 'string') {
      throw new Error('spec object should have .title string');
    }
  }

  static assertFullnameIsString(spec) {
    if (typeof spec.fullName !== 'string') {
      throw new Error('spec object should have .fullName string');
    }
  }

  static assertStatus(spec, expected) {
    if (spec.status !== expected) {
      throw new Error(`spec object should have .status === "${expected}"`);
    }
  }

  static getExpectedStatus(spec) {
    if (spec.title.startsWith('ok')) {
      return 'passed';
    } else if (spec.title.startsWith('fail')) {
      return 'failed';
    } else if (spec.title.startsWith('pending')) {
      return 'pending';
    } else {
      throw new Error('test name should start either from "ok", "fail" or "pending"; but it was: ' + spec.title);
    }
  }
}

module.exports = TestPlugin;
