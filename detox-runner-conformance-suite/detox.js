const FakeDetox = require('./FakeDetox');
const TestPlugin = require('./lib/TestPlugin');

module.exports = new FakeDetox().registerPlugin(new TestPlugin());
