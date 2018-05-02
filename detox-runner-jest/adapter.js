const detox = require('detox-runner-conformance-suite/detox');
const DetoxJestAdapter = require('./lib/DetoxJestAdapter');

module.exports = new DetoxJestAdapter(detox);
