const detox = require('detox');
const config = require('../package.json').detox;

// Set the default timeout
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

beforeAll(async () => {
  console.log('qweruasiysadsgdhsdjgsjsjgsdjdfgdfgdfghjdfhdjfdjkgjhfdghdfgfgjdfjkgdjfhgksdjftgshg')

  await detox.init(config);
  console.log('doneeeeee')
});

afterAll(async () => {
  await detox.cleanup();
});
