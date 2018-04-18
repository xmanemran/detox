const jest = require('./jest/index');
const mocha = require('./mocha/index');

module.exports = {
    implementations: {
        jest,
        mocha,
    },
    default: 'mocha',
};
