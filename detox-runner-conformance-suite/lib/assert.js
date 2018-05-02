const mapValues = require('lodash/mapValues');

const states = {
  ON_START_BEGIN: 0,
  ON_START_END: 1,
  BEFORE_ALL_BEGIN: 2,
  BEFORE_ALL_END: 3,
  BEFORE_TEST_BEGIN: 4,
  BEFORE_TEST_END: 5,
  BEFORE_EACH_BEGIN: 6,
  BEFORE_EACH_END: 7,
  TEST_BEGIN: 8,
  TEST_END: 9,
  AFTER_EACH_BEGIN: 10,
  AFTER_EACH_END: 11,
  AFTER_TEST_BEGIN: 12,
  AFTER_TEST_END: 13,
  AFTER_ALL_BEGIN: 4,
  AFTER_ALL_END: 5,
  ON_EXIT_BEGIN: 6,
  ON_EXIT_END: 7,
};

const assert = {
  _tests: 0,
  _assertions: 0,

  isIn(state, description) {
    const expected = state + (this._tests * 10);
    const counter = this._assertions;

    if (counter !== expected) {
      console.log('NOT in state =', description);
      const errorMessage = `test plugin integration failed, expected counter to be ${expected} but it was: ${counter}`;
      throw new Error(errorMessage);
    } else {
      console.log('in state =', description);

      this._assertions++;
      if (description === 'AFTER_TEST_END') {
        this._tests++;
      }
    }
  },

  state: mapValues(states, (value, key) => {
    return () => assert.isIn(value, key);
  }),
};

module.exports = assert;
