const { commandDescriptions } = require('../messages/cli/detox');

module.exports = [
  { name: 'test',                  description: commandDescriptions.test, },
  { name: 'build',                 description: commandDescriptions.build },
  { name: 'run-server',            description: commandDescriptions['run-server'] },
  { name: 'init',                  description: commandDescriptions.init },
  { name: 'clean-framework-cache', description: commandDescriptions['clean-framework-cache'] },
  { name: 'build-framework-cache', description: commandDescriptions['build-framework-cache'] },
];