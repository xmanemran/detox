class AutomaticVideoRecorder {
  constructor(config) {
    const detoxRecordVideosOption = config.detoxOptions.recordVideos;

    this.behavior = {
      recordVideosAutomatically: detoxRecordVideosOption !== 'none',
      keepOnlyFailedTestRecordings: detoxRecordVideosOption === 'failing',
    };

    this.recorder = config.recorder;
    this.artifactNamer = config.artifactNamer;

    this._finalizationTasks = [];
    this._ongoingVideoRecording = null;
  }

  async onBeforeTest(testInfo) {
    if (this._shouldStartVideoRecording(testInfo)) {
      const videoPath = this.artifactNamer.constructPathForTestArtifact(testInfo);
      this._ongoingVideoRecording = await this.recorder.recordVideo(videoPath);
    }
  }

  async onAfterTest(testInfo) {
    if (this._ongoingVideoRecording == null)  {
      return;
    }

    const recording = this._ongoingVideoRecording;
    const finalizationTask = this._shouldKeepVideoRecording(testInfo)
      ? recording.keep()
      : recording.discard();

    this._finalizationTasks.push(finalizationTask);
    this._ongoingVideoRecording = null;
  }

  async onExit() {
    await Promise.all(this._finalizationTasks);
  }

  _shouldStartVideoRecording(/* testInfo */) {
    return this.behavior.recordVideosAutomatically;
  }

  _shouldKeepVideoRecording(testInfo) {
    const testStatus = testInfo.status;

    if (this.behavior.keepOnlyFailedTestRecordings && testStatus !== 'failed') {
      return false;
    }

    return true;
  }

}

module.exports = AutomaticVideoRecorder;