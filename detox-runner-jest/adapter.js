const detox = require('detox');
const DetoxJestAdapter = require('./lib/DetoxJestAdapter');

module.exports = new DetoxJestAdapter(detox);
