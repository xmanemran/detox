const _ = require('lodash');
const DetoxRuntimeError = require('../../errors/DetoxRuntimeError');
const ADB = require('../../devices/android/ADB');
const ArtifactsManager = require('./ArtifactsManager');
const AndroidVideoRecorder = require('./services/videoRecorders/AndroidVideoRecorder');
const NoConflictPathStrategy = require('./services/pathStrategies/NoConflictPathStrategy');
const VideoRecorderHooks = require('./hooks/VideoRecorderHooks');

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
      ios: _.once(() => ({
        recordVideo: () => ({
          start() {
            return this;
          },
          stop() {
            return this;
          },
          save() {
            return this;
          },
          discard() {
            return this;
          }
        }),
      })),
      android: _.once((api) => new AndroidVideoRecorder({
        adb: resolve.adb(),
        deviceId: api.getDeviceId(),
        pathStrategy: resolve.artifacts.pathStrategy(),
        rootDir: api.getConfig().artifactsLocation,
      })),
      default: _.once((api) => {
        const supportedClasses = [
          'ios.simulator',
          'ios.none',
          'android.attached',
          'android.emulator',
        ];

        switch (api.getDeviceClass()) {
          case 'ios.simulator':
          case 'ios.none':
            return resolve.artifacts.videoRecorder.ios(api);
          case 'android.attached':
          case 'android.emulator':
            return resolve.artifacts.videoRecorder.android(api);
          default:
            throw new DetoxRuntimeError({
              message: `Failed to record video due to unknown device class: ${platformName}`,
              hint: `Only the following values are supported: ${supportedClasses.join(', ')}`,
            });
        }
      }),
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
        artifactsRootDir: api.getConfig().artifactsLocation || './artifacts',
      });

      return manager
        .registerHooks(resolve.artifacts.hooks.log(api))
        .registerHooks(resolve.artifacts.hooks.screenshot(api))
        .registerHooks(resolve.artifacts.hooks.video(api));
    }),
  },
};

module.exports = resolve.artifacts.artifactsManager;