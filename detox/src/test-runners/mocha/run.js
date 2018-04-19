const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const buildCliArgumentsString = require('../common/buildCliArgumentsString');
const getPlatformSpecificString = require('../common/getPlatformSpecificString');

function getDefaultRunnerConfig() {
    return 'e2e/mocha.opts';
}

function runMocha(config) {
    const mochaBin = 'node_modules/.bin/mocha';

    const testFolder = 'e2e';
    const commandLineArgs = {
        artifactsLocation: config.artifactsLocation,
        debugSynchronization: config.debugSynchronization,
        loglevel: config.loglevel,
        opts: config.runnerConfig,
        grep: getPlatformSpecificString(config.platform),
        cleanup: Boolean(config.cleanup),
        reuse: Boolean(config.reuse),
    };

    commandLineArgs.invert = !!commandLineArgs.grep;

    const command = `${mochaBin} ${testFolder} ${buildCliArgumentsString(commandLineArgs)}`;
    console.log(command);
    cp.execSync(command, {stdio: 'inherit'});
}

async function detect() {
    return fs.existsSync('e2e/mocha.opts');
}

function getDe(projectRoot) {
    return fs.existsSync('e2e/mocha.opts');
}


module.exports = {
    detect,
};
