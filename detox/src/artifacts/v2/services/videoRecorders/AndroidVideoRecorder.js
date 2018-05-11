const AndroidVideoRecording = require('./AndroidVideoRecording');
const GuardedVideoRecording = require('./GuardedVideoRecording');

class AndroidVideoRecorder {
  constructor(config) {
    this.adb = config.adb;
    this.deviceId = config.deviceId;
    this.childProcessManager = config.childProcessManager;
    this.artifactsLocator = config.artifactsLocator;
    this._recordingCounter = 0;
  }

  async recordVideo(artifactPath) {
    const recording = new AndroidVideoRecording({
      adb: this.adb,
      artifactPath,
      deviceId: this.deviceId,
      videoId: String(this._recordingCounter++),
      screenRecordOptions: {},
    });

    const guarded = new GuardedVideoRecording(recording);
    return guarded.start();
  }
}

module.exports = AndroidVideoRecorder;
