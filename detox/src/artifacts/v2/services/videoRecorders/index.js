const _ = require('lodash');
const AndroidVideoRecorder = require('./AndroidVideoRecorder');
const SafeVideoRecorder = require('./SafeVideoRecorder');
const DetoxRuntimeError = require('../../../../errors/DetoxRuntimeError');

const createAndroidVideoRecorder = _.once((api) => new AndroidVideoRecorder({
  adb: resolve.adb(),
  deviceId: api.getDeviceId(),
  pathStrategy: resolve.artifacts.pathStrategy(),
  rootDir: api.getConfig().artifactsLocation,
}));

// TODO: implement iOS video recorder
const createIosVideoRecorder = _.once(() => ({
  recordVideo: () => ({
    async start() {},
    async stop() {},
    async save() {},
    async discard() {}
  }),
}));

const _supportedClasses = [
  'ios.simulator',
  'ios.none',
  'android.attached',
  'android.emulator',
];

const createActualVideoRecorder = _.once((detoxApi) => {
  const deviceClass = detoxApi.getDeviceClass();

  switch (deviceClass) {
    case 'ios.simulator':
    case 'ios.none':
      return createIosVideoRecorder(detoxApi);
    case 'android.attached':
    case 'android.emulator':
      return createAndroidVideoRecorder(detoxApi);
    default:
      throw new DetoxRuntimeError({
        message: `Failed to record video due to unknown device class: ${deviceClass}`,
        hint: `Only the following values are supported: ${_supportedClasses.join(', ')}`,
      });
  }
});

const createSafeVideoRecorder = _.once((detoxApi) => {
  const artifactsRootDir = detoxApi.getConfig().artifactsLocation;

  return new SafeVideoRecorder({
    artifactsRootDir,
    recorder: createActualVideoRecorder(detoxApi),
  })
});

module.exports = {
  createSafeVideoRecorder,
};
