const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const UnhandledError = require('../../../../detox/src/errors/UnhandledError');

function doesDirectoryExist(directoryName) {
    const exists = _.attempt(() => fs.existsSync(directoryName));

    if (_.isError(exists)) {
        throw new UnhandledError(`Failed to check existence of directory: ${directoryName}`, exists);
    }

    return exists;
}

function copyDir(from, to) {
    const copyError = _.attempt(() => fs.copySync(from, to, { overwrite: false }));

    if (_.isError(copyError)) {
        _.attempt(() => fs.removeSync(to)); // clean up after failed copy
        throw new UnhandledError(`Failed to copy directory from ${from} to ${to}`, copyError);
    }
}

function printNewDirectoryContents(directoryName) {
    console.log('A directory was created in:', directoryName);

    const relativePath = path.relative(process.cwd(), directoryName);
    for (const filename of fs.readdirSync(directoryName)) {
        console.log('A file was created in:', path.join(relativePath, filename));
    }
}

function init() {
    const dirName = 'e2e';
    const factorySettingsDirectory = path.resolve(path.join(__dirname, 'e2e'));
    const scaffoldingDirectory = path.resolve(dirName);

    if (doesDirectoryExist(scaffoldingDirectory)) {
        console.error(`${scaffoldingDirectory} folder already exists.`);
        return -1;
    }

    copyDir(factorySettingsDirectory, scaffoldingDirectory);
    printNewDirectoryContents(scaffoldingDirectory);

    return 0;
}

module.exports = init;
