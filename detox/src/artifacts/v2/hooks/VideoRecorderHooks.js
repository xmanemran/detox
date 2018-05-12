class VideoRecorderHooks {
  constructor({
    enabled,
    keepOnlyFailedTestRecordings,
    recorder,
    pathStrategy,
  }) {
    this._enabled = enabled;
    this._keepOnlyFailedTestRecordings = keepOnlyFailedTestRecordings;
    this._recorder = recorder;
    this._pathStrategy = pathStrategy;
    this._finalizationTasks = [];
    this._ongoingVideoRecording = null;
  }

  async onStart() {}

  async onBeforeTest(testSummary) {
    if (this._shouldStartVideoRecording(testSummary)) {
      const pathToVideoFile = this._pathStrategy.constructPathForTestArtifact(testSummary, 'recording');
      this._ongoingVideoRecording = await this._recorder.recordVideo(pathToVideoFile);
    }
  }

  async onAfterTest(testSummary) {
    if (this._ongoingVideoRecording == null)  {
      return;
    }

    const recording = await this._ongoingVideoRecording.stop();
    const finalizationTask = this._shouldKeepVideoRecording(testSummary)
      ? recording.save()
      : recording.discard();

    this._finalizationTasks.push(finalizationTask);
    this._ongoingVideoRecording = null;
  }

  async onExit() {
    await Promise.all(this._finalizationTasks);
  }

  _shouldStartVideoRecording(/* testSummary */) {
    return this._enabled;
  }

  _shouldKeepVideoRecording(testSummary) {
    const testStatus = testSummary.status;

    if (this._keepOnlyFailedTestRecordings && testStatus !== 'failed') {
      return false;
    }

    return true;
  }
}

module.exports = VideoRecorderHooks;