const buildCliArgumentsString = require('../common/buildCliArgumentsString');

function addKeyValueToString(envString, [key, value]) {
    const keyValue = `${key}=${value}`;
    return envString + ' ' + keyValue;
}

function getEnvString(env) {
    return Object.entries(env).reduce(addKeyValueToString, '').trim();
}

function runJest({
    runnerConfig = getDefaultRunnerConfig(),
    platform,
}) {
    const configFile = runnerConfig ? `--config=${runnerConfig}` : '';
    const platformString = platform ? `--testNamePattern='^((?!${getPlatformSpecificString(platform)}).)*$'` : '';
    const pathToBin = 'node_modules/.bin/jest';

    const env = {
        configuration: program.configuration,
        loglevel: program.loglevel,
        cleanup: program.cleanup,
        reuse: program.reuse,
        debugSynchronization: program.debugSynchronization,
        artifactsLocation: program.artifactsLocation
    };

    const command = [
        pathToBin,
        testFolder,
        configFile,
        '--runInBand',
        platformString,
    ].join(' ');

    console.log(getEnvString(env), command);
    cp.execSync(command, {
        stdio: 'inherit',
        env: Object.assign({}, process.env, env),
    });
}

function getDefaultRunnerConfig() {
    return 'e2e/config.json';
}
