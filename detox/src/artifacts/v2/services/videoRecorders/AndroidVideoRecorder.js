const path = require('path');
const AndroidVideoRecording = require('./AndroidVideoRecording');

class AndroidVideoRecorder {
  constructor(config) {
    this.adb = config.adb;
    this.deviceId = config.deviceId;
    this.pathStrategy = config.pathStrategy;
    this.screenRecordOptions = config.screenRecordOptions;
    this.rootDir = config.rootDir;
    this._recordingCounter = 0;
  }

  recordVideo(relativeArtifactPath) {
    return new AndroidVideoRecording({
      adb: this.adb,
      artifactPath: path.join(this.rootDir, relativeArtifactPath + '.mp4'),
      deviceId: this.deviceId,
      videoId: String(this._recordingCounter++),
      screenRecordOptions: this.screenRecordOptions,
    });
  }
}

module.exports = AndroidVideoRecorder;
