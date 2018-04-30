const sleep = require('./sleep');

class TestPlugin {
  constructor() {
    this.counter = 0;
    this.specs = -1;
  }

  async onStart() {
    this.assertCounter(0);
    await sleep();
    this.assertCounter(1);
  }

  async beforeTest(spec) {
    this.assertCounter(4);
    await sleep();
    this.assertCounter(5);
  }

  async afterTest(spec) {
    this.assertCounter(12);
    await sleep();
    this.assertCounter(13);
    this.counter -= 10;
  }

  async onExit() {
    this.assertCounter(4);
    await sleep();
    this.assertCounter(5);
  }

  assertCounter(expected, isRelative) {
    if (this.counter !== expected) {
      throw new Error(`test plugin integration failed, expected counter to be ${expected} but it was ${this.counter}`);
    } else {
      console.log('assert counter =', expected, 'passed');
      this.counter++;
    }
  }
}

module.exports = new TestPlugin();
