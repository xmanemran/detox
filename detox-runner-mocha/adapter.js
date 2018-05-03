const detox = require('detox');
const DetoxMochaAdapter = require('./lib/DetoxMochaAdapter');

module.exports = new DetoxMochaAdapter(detox);
