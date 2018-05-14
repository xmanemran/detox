const fs = require('fs-extra');
const sleep = require('../../../../utils/sleep');

class AndroidVideoRecording {
  constructor(config) {
    debugger;
    this.videoId = config.videoId;
    this.deviceId = config.deviceId;
    this.adb = config.adb;
    this.screenRecordOptions = { ...config.screenRecordOptions };
    this.artifactPath = config.artifactPath;
    this.pathToVideoOnDevice = `/sdcard/${this.videoId}.mp4`;
    this.processPromise = null;
    this.process = null;
    this.started = false;
  }

  async start() {
    this.started = true;
    this.processPromise = this.adb.screenrecord(this.deviceId, {
      ...this.screenRecordOptions,
      path: this.pathToVideoOnDevice
    });

    this.process = this.processPromise.childProcess;
    await this._delayWhileVideoFileIsEmpty();
  }

  async stop() {
    this.process.kill('SIGINT');

    await this.processPromise.catch(e => {
      if (e.exitCode == null && e.childProcess.killed) {
        return;
      }

      throw e;
    });
  }

  async save() {
    await this._delayWhileVideoFileIsBusy();
    await fs.ensureFileSync(this.artifactPath);
    await this.adb.pull(this.deviceId, this.pathToVideoOnDevice, this.artifactPath);
    await this.adb.rm(this.deviceId, this.pathToVideoOnDevice);
  }

  async discard() {
    await this._delayWhileVideoFileIsBusy();
    await this.adb.rm(this.deviceId, this.pathToVideoOnDevice);
  }

  async _delayWhileVideoFileIsEmpty() {
    let size = await this._getVideoFileSizeOnDevice();

    while (size < 1) {
      await sleep(50);
      size = await this._getVideoFileSizeOnDevice();
    }
  }

  async _getVideoFileSizeOnDevice() {
    const { stdout, stderr } = await this.adb.adbCmd(this.deviceId, 'shell wc -c ' + this.pathToVideoOnDevice).catch(e => e);

    if (stderr.includes('No such file or directory')) {
      return -1;
    }

    return Number(stdout.slice(0, stdout.indexOf(' ')));
  }

  async _delayWhileVideoFileIsBusy() {
    let busy = await this._isVideoFileOnDeviceBusy();

    while (busy) {
      await sleep(50);
      busy = await this._isVideoFileOnDeviceBusy();
    }
  }

  async _isVideoFileOnDeviceBusy() {
    const output = await this.adb.shell(this.deviceId, 'lsof ' + this.pathToVideoOnDevice);
    return output.length > 0;
  }
}

module.exports = AndroidVideoRecording;