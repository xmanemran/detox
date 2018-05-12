const fs = require('fs-extra');

class AndroidVideoRecording {
  constructor(config) {
    this.videoId = config.videoId;
    this.deviceId = config.deviceId;
    this.adb = config.adb;
    this.screenRecordOptions = { ...config.screenRecordOptions };
    this.artifactPath = config.artifactPath;
    this.pathToVideoOnDevice = `/sdcard/${this.videoId}.mp4`;
    this.processPromise = null;
    this.process = null;
  }

  async start() {
    this.processPromise = this.adb.screenrecord(this.deviceId, {
      ...this.screenRecordOptions,
      path: this.pathToVideoOnDevice
    });

    this.process = this.processPromise.process;
    await this._delayWhileVideoFileIsEmpty();
  }

  async stop() {
    this.process.kill(2); // TODO: check how it is done
    await this.processPromise;
  }

  async save() {
    await this._delayWhileVideoFileIsBusy();
    await fs.ensureDir(this.artifactPath);
    await this.adb.pull(this.deviceId, this.pathToVideoOnDevice, this.artifactPath);
    await this.adb.rm(this.deviceId, this.pathToVideoOnDevice);
  }

  async discard() {
    await this._delayWhileVideoFileIsBusy();
    await this.adb.rm(this.deviceId, this.pathToVideoOnDevice);
  }

  async _delayWhileVideoFileIsEmpty() {
    // TODO: adb shell wc <file>
  }

  async _delayWhileVideoFileIsBusy() {
    // TODO: adb shell lsof <file>
  }
}

module.exports = AndroidVideoRecording;