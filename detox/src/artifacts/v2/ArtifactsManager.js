const _ = require('lodash');
const fs = require('fs-extra');
const NoConflictPathStrategy = require('./services/pathStrategies/NoConflictPathStrategy');
const VideoRecorderHooks = require('./hooks/VideoRecorderHooks');

class ArtifactsManager {
  constructor({ api }) {
    this.pathStrategy = new NoConflictPathStrategy();
    this.hooks = [];
 }

  static default({ api }) {
    const log = {};
    const screenshot = {};
    const recorder = {}; // api.getPlatform();
    const video = new VideoRecorderHooks({});

    return new ArtifactsManager(config)
      .registerHooks(log)
      .registerHooks(screenshot)
      .registerHooks(video);
  }

  registerHooks(hooks) {
    if (!('onStart' in hooks)) {
      hooks.onStart = _.noop;
    }

    if (!('onBeforeTest' in hooks)) {
      hooks.onBeforeTest = _.noop;
    }

    if (!('onAfterTest' in hooks)) {
      hooks.onAfterTest = _.noop;
    }

    if (!('onExit' in hooks)) {
      hooks.onExit = _.noop;
    }

    this.hooks.push(hooks);
    return this;
  }

  async onStart() {
    await this._probeArtifactsRootDir();
    await Promise.all(this.hooks.map(hook => hook.onStart()));
  }

  async _probeArtifactsRootDir() {
    await fs.ensureDir(this.pathStrategy.rootDir);
  }

  async _initVideoRecorder() {
    // this.videoRecorder = new AutomaticVideoRecorder
    // this.behavior = {
    //   recordVideosAutomatically: detoxRecordVideosOption !== 'none',
    //   keepOnlyFailedTestRecordings: detoxRecordVideosOption === 'failing',
    // };
  }

  async onBeforeTest() {
  }

  async onAfterTest() {

  }

  async onExit() {

  }

  static get defaultConfig() {
    return {
      pathStrategy: new NoConflictPathStrategy(),
      videoRecorder: new AndroidVideoRecorder(),
    };
  }
}

module.exports = ArtifactsManager;