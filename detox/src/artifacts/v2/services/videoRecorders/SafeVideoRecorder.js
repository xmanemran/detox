const path = require('path');
const DetoxRuntimeError = require('../../../../errors/DetoxRuntimeError');
const SafeVideoRecording = require('./SafeVideoRecording');

class SafeVideoRecorder {
  constructor({
    artifactsRootDir,
    recorder,
  }) {
    this.artifactsRootDir = path.resolve(artifactsRootDir);
    this.recorder = recorder;
  }

  recordVideo(relativeArtifactPath) {
    this._assertResolvedPathIsStillInsideArtifactsRootDir(relativeArtifactPath);

    const recording = this.recorder.recordVideo(relativeArtifactPath);
    return new SafeVideoRecording(recording);
  }

  _assertResolvedPathIsStillInsideArtifactsRootDir(relativeArtifactPath) {
    const fullArtifactPath = path.join(this.artifactsRootDir, relativeArtifactPath);
    const pathRelativeToArtifactsRootDir = path.relative(this.artifactsRootDir, fullArtifactPath);

    if (SafeVideoRecorder.IS_OUTSIDE.test(pathRelativeToArtifactsRootDir)) {
      throw new DetoxRuntimeError({
        message: `Given artifact location (${relativeArtifactPath}) was resolved outside of artifacts root directory (${this.artifactsRootDir})`,
        hint: `Make sure that video filename does not contain ".." fragments in path.`,
      });
    }
  }
}

SafeVideoRecorder.IS_OUTSIDE = /^\.\.[/\\]/g;

module.exports = SafeVideoRecorder;