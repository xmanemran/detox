function getDefaultRunnerConfig() {
    return 'e2e/mocha.opts';
}

function runMocha() {
    const loglevel = program.loglevel ? `--loglevel ${program.loglevel}` : '';
    const configuration = program.configuration ? `--configuration ${program.configuration}` : '';
    const cleanup = program.cleanup ? `--cleanup` : '';
    const reuse = program.reuse ? `--reuse` : '';
    const artifactsLocation = program.artifactsLocation ? `--artifacts-location ${program.artifactsLocation}` : '';
    const configFile = runnerConfig ? `--opts ${runnerConfig}` : '';
    const platformString = platform ? `--grep ${getPlatformSpecificString(platform)} --invert` : '';

    const debugSynchronization = program.debugSynchronization ? `--debug-synchronization ${program.debugSynchronization}` : '';
    const command = `node_modules/.bin/mocha ${testFolder} ${configFile} ${configuration} ${loglevel} ${cleanup} ${reuse} ${debugSynchronization} ${platformString} ${artifactsLocation}`;

    console.log(command);
    cp.execSync(command, {stdio: 'inherit'});
}
