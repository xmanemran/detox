module.exports = {
  _tests: 0,
  _assertions: 0,

  isIn(state) {
    const expected = state + (this._tests * 10);
    const counter = this._assertions;

    if (counter !== expected) {
      throw new Error(`test plugin integration failed, expected counter to be ${expected} but it was: ${counter}`);
    } else {
      console.log('assert state =', state);
      this._assertions++;
    }
  },

  state: {
    ON_START_BEGIN:    () => assert.isIn(0),
    ON_START_END:      () => assert.isIn(1),
    BEFORE_ALL_BEGIN:  () => assert.isIn(2),
    BEFORE_ALL_END:    () => assert.isIn(3),
    BEFORE_TEST_BEGIN: () => assert.isIn(4),
    BEFORE_TEST_END:   () => assert.isIn(5),
    BEFORE_EACH_BEGIN: () => assert.isIn(6),
    BEFORE_EACH_END:   () => assert.isIn(7),
    TEST_BEGIN:        () => assert.isIn(8),
    TEST_END:          () => assert.isIn(9),
    AFTER_EACH_BEGIN:  () => assert.isIn(10),
    AFTER_EACH_END:    () => assert.isIn(11),
    AFTER_TEST_BEGIN:  () => assert.isIn(12),
    AFTER_TEST_END:    () => assert.isIn(13),
    AFTER_ALL_BEGIN:   () => assert.isIn(14),
    AFTER_ALL_END:     () => assert.isIn(15),
    ON_EXIT_BEGIN:     () => assert.isIn(16),
    ON_EXIT_END:       () => assert.isIn(17),
  },
};
