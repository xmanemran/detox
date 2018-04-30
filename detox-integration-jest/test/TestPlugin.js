const sleep = require('./sleep');

class TestPlugin {
  constructor() {
    this.counter = 0;
    this.tests = 0;
  }

  async onStart() {
    this.assertCounter(0);
    await sleep();
    this.assertCounter(1);
  }

  async beforeTest(spec) {
    TestPlugin.assertSpecIsReadonly(spec);
    TestPlugin.assertTitleIsString(spec);
    TestPlugin.assertFullnameIsString(spec);
    TestPlugin.assertStatus(spec, 'running');

    this.assertCounter(4);
    await sleep();
    this.assertCounter(5);
  }

  async afterTest(spec) {
    TestPlugin.assertStatus(spec, TestPlugin.getExpectedStatus(spec));

    this.assertCounter(12);
    await sleep();
    this.assertCounter(13);

    this.tests++;
  }

  async onExit() {
    this.assertCounter(4);
    await sleep();
    this.assertCounter(5);
    console.log('INTEGRATION TEST PASSED');
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

  assertCounter(relativeExpected) {
    const expected = relativeExpected + (this.tests * 10);

    if (this.counter !== expected) {
      throw new Error(`test plugin integration failed, expected counter to be ${expected} but it was ${this.counter}`);
    } else {
      console.log('assert counter =', expected, 'passed');
      this.counter++;
    }
  }
}

module.exports = new TestPlugin();
