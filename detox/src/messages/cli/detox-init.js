const j = s => JSON.stringify(s);

module.exports = {
    runnerParamDescription: (supportedTestRunners) =>
        `Test runner (currently supports: ${supportedTestRunners})`,
    errorNotSupportedTestRunner: (givenTestRunnerName) =>
        `ERROR! Test runner ${j(givenTestRunnerName)} is not supported.`,
    hintSupportedTestRunners: (supportedTestRunners) =>
        `Supported runners are: ${supportedTestRunners}`,
};