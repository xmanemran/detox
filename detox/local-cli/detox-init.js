const program = require('commander');
const runners = require('../src/test-runners/index.js');

const supportedTestRunners = Object.keys(runners.implementations).join(', ');

const messages = {
    runnerParamDescription:
        `Test runner (currently supports: ${supportedTestRunners})`,
    errorNotSupportedTestRunner: (givenTestRunnerName) =>
        `ERROR! Test runner ${JSON.stringify(givenTestRunnerName)} is not supported.`,
    hintSupportedTestRunners:
        `Supported runners are: ${supportedTestRunners}`,
};

program
    .option('-r, --runner [runner]', messages.runnerParamDescription, runners.default)
    .parse(process.argv);

const runnerName = program.runner;
const runner = runners.implementations[runnerName] || null;

if (runner === null) {
    program.help(helpMessage => (
        messages.errorNotSupportedTestRunner(runnerName) + '\n' +
        messages.hintSupportedTestRunners + '\n' +
        helpMessage
    ));
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
