const detox = require('detox');
const DetoxJestAdapter = require('./lib/DetoxJestAdapter');

module.exports = {
  adapter: new DetoxJestAdapter(detox),
};
