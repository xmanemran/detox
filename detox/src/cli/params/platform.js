module.exports = {
  alias: 'p',
  name: 'platform',
  hint: 'ios/android',
  optional: true,
  description:
    '[DEPRECATED], platform is deduced automatically. ' + 
    'Run platform specific tests. ' +
    'Runs tests with invert grep on \':platform:\', ' +
    'e.g test with substring \':ios:\' in its name will ' +
    'not run when passing \'--platform android\'',
};
