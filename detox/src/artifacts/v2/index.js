const _ = require('lodash');
const NoConflictPathStrategy = require('./services/pathStrategies/NoConflictPathStrategy');
const AndroidVideoRecorder = require('./services/videoRecorders/AndroidVideoRecorder');
const SafeVideoRecorder = require('./services/videoRecorders/SafeVideoRecorder');
const ADB = require('../../devices/android/ADB');
const DetoxRuntimeError = require('../../errors/DetoxRuntimeError');
const ArtifactsManager = require('./ArtifactsManager');
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
      android: _.once((api) => new AndroidVideoRecorder({
        adb: resolve.adb(),
        deviceId: api.getDeviceId(),
        pathStrategy: resolve.artifacts.pathStrategy(),
        rootDir: api.getConfig().artifactsLocation,
        screenRecordOptions: { verbose: true },
      })),
      ios: _.once(() => ({
        recordVideo: () => ({
          async start() {},
          async stop() {},
          async save() {},
          async discard() {}
        }),
      })),
      actual: _.once((detoxApi) => {
        const deviceClass = detoxApi.getDeviceClass();

        switch (deviceClass) {
          case 'ios.simulator':
          case 'ios.none':
            return resolve.artifacts.videoRecorder.ios(detoxApi);
          case 'android.attached':
          case 'android.emulator':
            return resolve.artifacts.videoRecorder.android(detoxApi);
          default:
            const _supportedClasses = [
              'ios.simulator',
              'ios.none',
              'android.attached',
              'android.emulator',
            ];

            throw new DetoxRuntimeError({
              message: `Failed to record video due to unknown device class: ${deviceClass}`,
              hint: `Only the following values are supported: ${_supportedClasses.join(', ')}`,
            });
        }
      }),
      safe: _.once((detoxApi) => {
        const artifactsRootDir = detoxApi.getConfig().artifactsLocation;

        return new SafeVideoRecorder({
          artifactsRootDir,
          recorder: resolve.artifacts.videoRecorder.actual(detoxApi),
        });
      }),
      default: (api) => resolve.artifacts.videoRecorder.safe(api)
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