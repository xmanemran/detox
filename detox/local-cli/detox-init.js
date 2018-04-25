const program = require('commander');
const runners = require('../src/test-runners/index.js');
const messages = require('../src/messages/cli/detox-init');

const supportedTestRunners = Object.keys(runners.implementations).join(', ');

program
    .option('-r, --runner [runner]', messages.runnerParamDescription(supportedTestRunners), runners.default)
    .parse(process.argv);

const runnerName = program.runner;
const runner = runners.implementations[runnerName] || null;

if (runner === null) {
    program.help(helpMessage => [
        messages.errorNotSupportedTestRunner(runnerName),
        messages.hintSupportedTestRunners(supportedTestRunners),
        helpMessage,
    ].join('\n'));
}

async function main() {
    return runner.init();
}

function printError(e) {
    console.error('See error below:\n');

    if ('message' in e) {
        console.error('Error:', e.message);
    }

    if ('innerError' in e) {
        console.error(e.innerError.message);
        console.error('\n', e.innerError);
    } else {
        console.error(e);
    }
}

main().catch(e => {
    console.error('Failed to scaffold environment for', runnerName, 'test runner.')

    if (e) {
        printError(e);

        if ('exitCode' in e) { // TODO: there is Node built-in error code field into Error
            return e.exitCode;
        }
    }

    return -1;
}).then(code => process.exit(code));
