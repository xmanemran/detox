class AndroidVideoRecording {
  constructor(config) {
    this.id = config.id;
    this.onStart = null;
    this.adb = config.adb;
    this.childProcessManager = config.childProcessManager;
    this.recordingHandle = null;
  }

  async start() {
    if (this.onStart) {
      return this.onStart;
    }

    this.onStart = this._startRecording();
  }

  async _startRecording() {
    await this._delayWhileVideoFileIsBusy()
  }

  async keep() {

  }

  async discard() {

  }

  async _attemptScreenRecording({ size, bitRate, timeLimit, verbose }) {
    this.recordingHandle = this.childProcessManager.spawn(this.adb.binaryPath, ['screenrecord'], {

    });

  }

  async _getDeviceScreenResolution() {
    const { stdout } = this._adbCmd('shell', 'wm', 'size');
    const [ width, height ] = stdout.split(' ').pop().split('x');

    return {
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    };
  }

  async _delayWhileVideoFileIsEmpty() {

  }

  async _delayWhileVideoFileIsBusy() {

  }

  async _adbCmd(...args) {
    const deviceId = this.deviceId;
    const serial = deviceId ? `-s ${deviceId}` : '';
    const cmd = `${this.adbBin} ${serial} ${args}`;

    return this.childProcessManager.exec(cmd);
  }
}

module.exports = AndroidVideoRecording;