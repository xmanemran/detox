module.exports = {
  alias: 'd',
  name: 'debug-synchronization',
  hint: 'value',
  description:
    'When an action/expectation takes a significant amount of time, ' +
    'use this option to print device synchronization status. ' +
    'The status will be printed if the action takes more than [value]ms to complete',
  transform: (value) => value === true ? 3000 : value,
};
