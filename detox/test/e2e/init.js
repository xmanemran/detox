const detox = require('detox');
const config = require('../package.json').detox;

// Set the default timeout
jasmine.DEFAULT_TIMEOUT_INTERVAL = 240000;

beforeAll(async () => {
  console.log('This process is your pid ' + process.pid);
  console.log('fdsfsfsdafasd;fousadflkasdfsadf  fasdfsdafdsasdfasdf')
  await detox.init(config);
});

afterAll(async () => {
  await detox.cleanup();
});
//
//beforeEach(async function() {
//  await detox.beforeEach(this.currentTest.parent.title, this.currentTest.title);
//});
//
//afterEach(async function() {
//  await detox.afterEach();
//});