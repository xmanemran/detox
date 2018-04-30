function sleep(ms = sleep.defaultMs) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

sleep.defaultMs = 500;

module.exports = sleep;
