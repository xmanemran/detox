const _ = require('lodash');
const DetoxRuntimeError = require('../../errors/DetoxRuntimeError');
const DetoxChildProcessError = require('../../errors/DetoxChildProcessError');

class AAPT {
  constructor(config) {
    this._assertOptionsAreNotEmpty(config);
    this._assertBinaryPathIsNotEmpty(config);
    this._assertBinaryPathExists(config);
    this.aaptBin = config.aaptBin;
    this.childProcessManager = config.childProcessManager;
  }

  /**
   * @see {@link https://stackoverflow.com/a/6289168}
   */
  async readPackageNameFromAPK(apkPath) {
    this._assertApkPathIsNotEmpty(apkPath);
    const aapt = this.aaptBin;
    const command = `${aapt} dump badging "${apkPath}"`;
    const process = await this.childProcessManager.exec(command).catch(e => e);
    if (_.isError(process)) {
      this._rethrowChildProcessError(process, command);
    }
    const packageName = AAPT.PACKAGE_REGEXP.exec(process.stdout);
    if (!packageName) {
      throw new DetoxChildProcessError({
        message: 'could not find the package name in aapt stdout',
        command,
        stdout: process.stdout,
        stderr: process.stderr,
      });
    }
    return packageName[1];
  }

  _assertOptionsAreNotEmpty(options) {
    if (!options) {
      throw new DetoxRuntimeError({
        message: `${AAPT.name}.constructor() did not receive any options`,
        hint: `Make sure you are passing non-empty options to new ${AAPT.name}(options)`,
      });
    }
  }

  _assertBinaryPathIsNotEmpty(options) {
    if (!options.aaptBin) {
      throw new DetoxRuntimeError({
        message: `${AAPT.name}.constructor(options) did not get binary path of *aapt*`,
        hint: `Options passed to constructor were: ${JSON.stringify(options)}`,
      });
    }
  }

  _assertBinaryPathExists(options) {
    if (!fs.existsSync(options.aaptBin)) {
      throw new DetoxRuntimeError({
        message: `*aapt* binary was not found`,
        hint: `Make sure it exists at path: ${options.aaptBin}`,
      });
    }
  }

  _assertApkPathIsNotEmpty(apkPath) {
    if (!apkPath) {
      throw new DetoxRuntimeError({
        message: 'No path to APK file is specified',
        hint: 'Make sure that AAPT.readPackageNameFromAPK(apkPath) gets valid path.'
      });
    }
  }

  _rethrowChildProcessError(error, command) {
    /* istanbul ignore next */
    if (!isChildProcessError(error)) { // NOTE: this is a currently impossible case, but let's leave this check
      throw new DetoxChildProcessError({
        message: error.message,
        command,
        error,
      });
    }

    throw new DetoxChildProcessError({
      command,
      code: error.code,
      stdout: error.stdout,
      stderr: error.stderr,
    });
  }
}

module.exports = AAPT;
