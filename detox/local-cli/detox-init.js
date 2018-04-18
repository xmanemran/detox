const program = require('commander');
const runners = require('../src/test-runners/index.js');

const supportedTestRunners = Object.keys(runners.implementations).join(', ');

const messages = {
    runnerParamDescription: `Test runner (currently supports: ${supportedTestRunners})`,
    errorNotSupportedTestRunner: (givenTestRunnerName) =>
        `ERROR! Test runner ${JSON.stringify(givenTestRunnerName)} is not supported.`,
    hintSupportedTestRunners: `Supported runners are: ${supportedTestRunners}`,
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
    await runner.init();
}

main().then(code => process.exit(code)).catch(e => {
    console.error('Failed to scaffold environment for', runnerName, 'test runner.')
    console.error('See error below:\n');

    if ('innerError' in e) {
        console.error('Error:', e.message);
        console.error(e.innerError.message);
        console.error('\n', e.innerError);
    } else {
        console.error(e);
    }

    if ('exitCode' in e) {
        process.exit(e.exitCode);
    } else {
        process.exit(-1);
    }
});
