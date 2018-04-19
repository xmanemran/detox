#!/usr/bin/env node

const _ = require('lodash');
const program = require('commander');
const DetoxConfigError = require('../src/errors/DetoxConfigError');
const detoxSectionInPackageJson = require(path.join(process.cwd(), 'package.json').detox;

const runners = require('../src/test-runners/index.js');

const lookup = (dictionary, transformKey = _.identity) => (key) => dictionary[transformKey(key)];
const lookupInCommandLineArguments = lookup(program);
const lookupAsIsInConfig = lookup(config);
const lookupKebabInConfig = lookup(config, _.kebabCase);
const lookupEverywhere = (key) => lookupInCommandLineArguments(key) || lookupAsIsInConfig(key) || lookupKebabInConfig(key);

program
  .option('-c, --configuration [device configuration]',
    'Select a device configuration from your defined configurations, if not supplied, and there\'s only one configuration, detox will default to it')
  .option('-o, --runner-config [config]',
    `Test runner config file, defaults to e2e/mocha.opts for mocha and e2e/config.json' for jest`)
  .option('-s, --specs [relativePath]',
    `Root of test folder`)
  .option('-l, --loglevel [value]',
    'info, debug, verbose, silly, wss')
  .option('-r, --reuse',
    'Reuse existing installed app (do not delete and re-install) for a faster run.')
  .option('-u, --cleanup',
    'Shutdown simulator when test is over, useful for CI scripts, to make sure detox exists cleanly with no residue')
  .option('-d, --debug-synchronization [value]',
    'When an action/expectation takes a significant amount of time use this option to print device synchronization status.' +
    'The status will be printed if the action takes more than [value]ms to complete',
    (value) => value === true ? 3000 : value)
  .option('-a, --artifacts-location [path]',
    'Artifacts destination path (currently will contain only logs). If the destination already exists, it will be removed first')
  .option('-p, --platform [ios/android]',
    '[DEPRECATED], platform is deduced automatically. Run platform specific tests. Runs tests with invert grep on \':platform:\', '
    + 'e.g test with substring \':ios:\' in its name will not run when passing \'--platform android\'')
  .option('-f, --file [path]',
    'Specify test file to run')
  .parse(process.argv);



function getConfigurationName() {
    const configurationName = program.configuration || getFirstAndOnlyConfiguration(detoxSectionInPackageJson);

    if (!configurationName) {
        const errorDescription = 'Cannot determine which configuration to use.';

        const availableConfigurations = _.keys(detoxSectionInPackageJson.configurations);
        const hint = (availableConfigurations.length === 0)
            ? `Use --configuration to choose one of the following: ${availableConfigurations.join(', ')}`
            : 'There are no available detox configurations in your package.json';

        throw new DetoxConfigError(errorDescription + '\n' + hint);
    }

    return configurationName;
}

function getFirstAndOnlyConfiguration(detoxConfig) {
    if (_.size(detoxConfig.configurations) === 1) {
        return _.keys(detoxConfig.configurations)[0];
    }
}

function getCurrentDetoxConfiguration() {
    const configurationName = getConfigurationName();
    const currentDetoxConfiguration = detoxSectionInPackageJson.configurations[configurationName];

    if (!currentDetoxConfiguration) {
        const errorDescription =`Cannot find configuration '${program.configuration}' in detox section in package.json`;

        const availableConfigurations = _.keys(detoxSectionInPackageJson.configurations);
        const hint = (availableConfigurations.length === 0)
            ? `Available configurations: ${availableConfigurations.join(', ')}`
            : 'There are no available detox configurations in your package.json';

        throw new DetoxConfigError(errorDescription + '\n' + hint);
    }

    return currentDetoxConfiguration;
}

const currentDetoxConfiguration = getCurrentDetoxConfiguration();
const [platform] = currentDetoxConfiguration.type.split('.');
const runner = lookupEverywhere('testRunner');

async function addGuess([testRunnerName, implementation]) {
    return (await implementation.detect()) ? testRunnerName : undefined;
}

async function guess() {
    const guesses = _.compact(await Promise.all(Object.entries(runners.implementations).map(addGuess)));
    if (guesses.length !== 1) {
        const errorDescription = 'Cannot guess what test runner you are using.';
        const hint = 'Try to add it to your Detox configuration in package.json, like this:\n' + JSON.stringify({

        });
        throw new DetoxConfigError('')
//   const hint = `Missing 'runner-config' value in detox config in package.json, using '${defaultConfig}' as default for ${runner}`;
//       throw new Error(`${runner} is not supported in detox cli tools. You can still run your tests with the runner's own cli tool`);
    }
    Promise.all(.map(async ([name, impl]) => {
        return (await impl.detect()) ? name : undefined;
    }));
}
if (!runner) {
}

//
// run({
//     testFolder: getConfigFor(['file', 'specs']) || 'e2e',
//
//     runnerConfig: getConfigFor(['runnerConfig']) || getDefaultRunnerConfig(),
//     platform,
// });
//
// function run() {
//   switch (runner) {
//     case 'mocha':
//       runMocha();
//       break;
//     case 'jest':
//       runJest();
//       break;
//     default:
//   }
// }
//
//
//
// function getConfigFor(keys, fallback) {
//   for (const key of keys) {
//       const result = lookupEverywhere(key);
//
//       if (result) {
//           return result;
//       }
//   }
//
//   return fallback;
// ;
//
// function getDefaultRunnerConfig() {
// }


