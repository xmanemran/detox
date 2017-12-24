const Detox = require('./Detox');

let detox;

async function init(config, params) {
  //if (!detox) {
    console.log('Detox init!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    detox = new Detox(config);
    await detox.init(params);
  //}
}

async function cleanup() {
  if (detox) {
    console.log('Detox cleanup!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    await detox.cleanup();
  }
}

async function beforeEach() {
  if (detox) {
    await detox.beforeEach.apply(detox, arguments);
  }
}

async function afterEach() {
  if (detox) {
    await detox.afterEach.apply(detox, arguments);
  }
}

//process.on('uncaughtException', (err) => {
//  //client.close();
//
//  throw err;
//});
//
//process.on('unhandledRejection', (reason, p) => {
//  throw reason;
//});

module.exports = {
  init,
  cleanup,
  beforeEach,
  afterEach
};
