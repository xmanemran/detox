const _ = require('lodash');
const fs = require('fs-extra');
const log = require("npmlog");
const path = require('path');

const PREFIX = "detox-runner-jest";

function doesDirectoryExist(directoryName) {
  const exists = _.attempt(() => fs.existsSync(directoryName));

  if (_.isError(exists)) {
    log.error(PREFIX, 'Failed to check existence of directory: %s.', directoryName);
    throw exists;
  }

  return exists;
}

function copyDir(from, to) {
  const copyError = _.attempt(() => fs.copySync(from, to, { overwrite: false }));

  if (_.isError(copyError)) {
    _.attempt(() => fs.removeSync(to)); // clean up after failed copy

    log.error(PREFIX, 'Failed to copy directory from: %s to %s.', from, to);
    throw copyError;
  }
}

function printNewDirectoryContents(directoryName) {
  log.info(PREFIX, `A directory was created in: %s`, directoryName);

  const relativePath = path.relative(process.cwd(), directoryName);
  for (const filename of fs.readdirSync(directoryName)) {
    log.info(PREFIX, `A file was created in: %s`, path.join(relativePath, filename));
  }
}

function init() {
  const dirName = 'e2e';
  const factorySettingsDirectory = path.resolve(path.join(__dirname, 'template'));
  const scaffoldingDirectory = path.resolve(dirName);

  if (doesDirectoryExist(scaffoldingDirectory)) {
    log.error(PREFIX, "Folder already exists at path: %s", scaffoldingDirectory);
    throw null;
  }

  copyDir(factorySettingsDirectory, scaffoldingDirectory);
  printNewDirectoryContents(scaffoldingDirectory);
}

module.exports = () => {
  try { init (); }
  catch (e) { e && log.error(PREFIX, e); }
};

