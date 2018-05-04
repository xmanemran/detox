class AndroidVideoRecorder {
  constructor(config) {
    this.adbBin = config.adbBin;
    this.deviceId = config.deviceId;
    this.childProcessManager = config.childProcessManager;
    this.artifactsLocator = config.artifactsLocator;
  }

  recordVideo() {
    return new AndroidVideoRecording({

    });
  }
}

module.exports = AndroidVideoRecorder;
