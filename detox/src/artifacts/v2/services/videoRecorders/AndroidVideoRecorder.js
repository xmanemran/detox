const path = require('path');
const AndroidVideoRecording = require('./AndroidVideoRecording');
const GuardedVideoRecording = require('./GuardedVideoRecording');

class AndroidVideoRecorder {
  constructor(config) {
    this.adb = config.adb;
    this.deviceId = config.deviceId;
    this.pathStrategy = config.pathStrategy;
    this.rootDir = config.rootDir;
    this._recordingCounter = 0;
  }

  async recordVideo(relativeArtifactPath) {
    const recording = new AndroidVideoRecording({
      adb: this.adb,
      artifactPath: path.join(this.rootDir, relativeArtifactPath + '.mp4'),
      deviceId: this.deviceId,
      videoId: String(this._recordingCounter++),
    });

    const guarded = new GuardedVideoRecording(recording);
    return guarded.start();
  }
}

module.exports = AndroidVideoRecorder;
