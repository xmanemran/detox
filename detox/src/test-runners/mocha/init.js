const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const UnhandledError = require('../../errors/UnhandledError');

const dirName = 'e2e';
const factorySettingsDirectory = path.resolve(path.join(__dirname, dirName));
const scaffoldingDirectory = path.resolve(dirName);

function init() {
    const exists = _.attempt(() => fs.existsSync(scaffoldingDirectory));

    if (_.isError(exists)) {
        throw new UnhandledError(`Failed to check existence of directory: ${scaffoldingDirectory}`, exists);
    }

    if (exists) {
        console.error(`${scaffoldingDirectory} folder already exists.`);
        return -1;
    }

    const copyError = _.attempt(() => fs.copySync(factorySettingsDirectory, scaffoldingDirectory, {
        overwrite: false,
    }));

    if (_.isError(copyError)) {
        _.attempt(() => fs.removeSync(scaffoldingDirectory));
        throw new UnhandledError(`Failed to copy directory from ${factorySettingsDirectory} to ${factorySettingsDirectory}`, copyError);
    }

    console.log('A directory was created in:', scaffoldingDirectory);
    for (const filename of fs.readdirSync(scaffoldingDirectory)) {
        console.log('A file was created in:', path.relative('.', path.join(scaffoldingDirectory, filename)));
    }
}

module.exports = init;
