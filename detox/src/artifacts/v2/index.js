const _ = require('lodash');
const ADB = require('../../devices/android/ADB');
const ArtifactsManager = require('./ArtifactsManager');
const NoConflictPathStrategy = require('./services/pathStrategies/NoConflictPathStrategy');
const VideoRecorderHooks = require('./hooks/VideoRecorderHooks');
const { createSafeVideoRecorder } = require('./services/videoRecorders');

const resolve = {
  adb: _.once(() => new ADB()),
  artifacts: {
    pathStrategy: _.once(() => new NoConflictPathStrategy()),
    logger: {
      ios: () => null,
      android: () => null,
      default: () => null,
    },
    screenshotter: {
      ios: () => null,
      android: () => null,
      default: () => null,
    },
    videoRecorder: {
      default: createSafeVideoRecorder,
    },
    hooks: {
      log: _.once(() => ({})),
      screenshot: _.once(() => ({})),
      video: _.once((api) => {
        const { recordVideos } = api.getConfig();

        return new VideoRecorderHooks({
          enabled: recordVideos !== 'none',
          keepOnlyFailedTestRecordings: recordVideos === 'failed',
          recorder: resolve.artifacts.videoRecorder.default(api),
          pathStrategy: resolve.artifacts.pathStrategy(api),
        });
      }),
    },

    artifactsManager: _.once((api) => {
      const manager = new ArtifactsManager({
        artifactsRootDir: api.getConfig().artifactsLocation,
      });

      return manager
        .registerHooks(resolve.artifacts.hooks.log(api))
        .registerHooks(resolve.artifacts.hooks.screenshot(api))
        .registerHooks(resolve.artifacts.hooks.video(api));
    }),
  },
};

module.exports = resolve.artifacts.artifactsManager;