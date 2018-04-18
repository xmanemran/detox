function runJest() {
    const configFile = runnerConfig ? `--config=${runnerConfig}` : '';
    const platformString = platform ? `--testNamePattern='^((?!${getPlatformSpecificString(platform)}).)*$'` : '';
    const command = `node_modules/.bin/jest ${testFolder} ${configFile} --runInBand ${platformString}`;
    console.log(command);
    cp.execSync(command, {
        stdio: 'inherit',
        env: Object.assign({}, process.env, {
            configuration: program.configuration,
            loglevel: program.loglevel,
            cleanup: program.cleanup,
            reuse: program.reuse,
            debugSynchronization: program.debugSynchronization,
            artifactsLocation: program.artifactsLocation
        })
    });
}

function getDefaultRunnerConfig(runnerName) {
    return 'e2e/config.json';
}
