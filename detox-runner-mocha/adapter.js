const detox = require('detox-runner-conformance-suite/detox');
const DetoxMochaAdapter = require('./lib/DetoxMochaAdapter');

module.exports = new DetoxMochaAdapter(detox);
