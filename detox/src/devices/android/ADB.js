const path = require('path');
const {execWithRetriesAndLogs, spawnAndLog} = require('../../utils/exec');
const _ = require('lodash');
const EmulatorTelnet = require('./EmulatorTelnet');
const Environment = require('../../utils/environment');

class ADB {

  constructor() {
    this.adbBin = path.join(Environment.getAndroidSDKPath(), 'platform-tools', 'adb');
  }

  async devices() {
    const output = (await this.adbCmd('', 'devices')).stdout;
    return await this.parseAdbDevicesConsoleOutput(output);
  }

  async parseAdbDevicesConsoleOutput(input) {
    const outputToList = input.trim().split('\n');
    const devicesList = _.takeRight(outputToList, outputToList.length - 1);
    const devices = [];
    for (const deviceString of devicesList) {
      const deviceParams = deviceString.split('\t');
      const deviceAdbName = deviceParams[0];
      let device;
      if (this.isEmulator(deviceAdbName)) {
        const port = _.split(deviceAdbName, '-')[1];
        const telnet = new EmulatorTelnet();
        await telnet.connect(port);
        const name = await telnet.avdName();
        device = {type: 'emulator', name: name, adbName: deviceAdbName, port: port};
        await telnet.quit();
      } else if (this.isGenymotion(deviceAdbName)) {
        device = {type: 'genymotion', name: deviceAdbName, adbName: deviceAdbName};
      } else {
        device = {type: 'device', name: deviceAdbName, adbName: deviceAdbName};
      }
      devices.push(device);
    }
    return devices;
  }

  isEmulator(deviceAdbName) {
    return _.includes(deviceAdbName, 'emulator-');
  }

  isGenymotion(string) {
    return (/^((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:)){4}[0-9]{4}/.test(string));
  }

  async install(deviceId, apkPath) {
    const apiLvl = await this.apiLevel(deviceId);
    if (apiLvl >= 24) {
      await this.adbCmd(deviceId, `install -r -g ${apkPath}`);
    } else {
      await this.adbCmd(deviceId, `install -rg ${apkPath}`);
    }
  }

  async uninstall(deviceId, appId) {
    await this.adbCmd(deviceId, `uninstall ${appId}`);
  }

  async terminate(deviceId, appId) {
    await this.shell(deviceId, `am force-stop ${appId}`);
  }

  async unlockScreen(deviceId) {
    await this.shell(deviceId, `input keyevent 82`);
  }

  async shell(deviceId, cmd) {
    return (await this.adbCmd(deviceId, `shell ${cmd}`)).stdout.trim();
  }

  async waitForBootComplete(deviceId) {
    try {
      const bootComplete = await this.shell(deviceId, `getprop dev.bootcomplete`);
      if (bootComplete === '1') {
        return true;
      } else {
        await this.sleep(2000);
        return await this.waitForBootComplete(deviceId);
      }
    } catch (ex) {
      await this.sleep(2000);
      return await this.waitForBootComplete(deviceId);
    }
  }

  async apiLevel(deviceId) {
    const lvl = await this.shell(deviceId, `getprop ro.build.version.sdk`);
    return Number(lvl);
  }

  async adbCmd(deviceId, params) {
    const serial = `${deviceId ? `-s ${deviceId}` : ''}`;
    const cmd = `${this.adbBin} ${serial} ${params}`;
    return await execWithRetriesAndLogs(cmd, undefined, undefined, 1);
  }

  async sleep(ms = 0) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  async getScreenSize(deviceId) {
    const {stdout} = await this.adbCmd(deviceId, `shell wm size`);
    const [width, height] = stdout.split(' ').pop().split('x');
    return {
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    };
  }

  async getFileSize(deviceId, path) {
    const {stdout} = await this.adbCmd(deviceId, `shell wc -c ${path}`);
    return parseInt(stdout, 10);
  }

  screencap(deviceId, path) {
    return this.adbCmd(deviceId, `shell screencap ${path}`);
  }

  screenrecord(deviceId, { path, size, bitRate, timeLimit, verbose }) {
    const [ width = 0, height = 0 ] = size || [];

    const _size = (width > 0) && (height > 0)
      ? ['--size', `${width}x${height}`]
      : [];

    const _bitRate = (bitRate > 0)
      ? ['--bit-rate', String(bitRate)]
      : [];

    const _timeLimit = (timeLimit > 0)
      ? [`--time-limit`, timeLimit]
      : [];

    const _verbose = verbose ? ['--verbose'] : [];
    const screenRecordArgs = [..._size, ..._bitRate, ..._timeLimit, ..._verbose, path];

    return this.spawn(deviceId, ['shell', 'screenrecord', ...screenRecordArgs]);
  }

  pull(deviceId, src, dst = '') {
    return this.adbCmd(deviceId, `pull "${src}" "${dst}"`);
  }

  rm(deviceId, path, force = false) {
    return this.adbCmd(deviceId, `shell rm ${force ? '-f' : ''} "${path}"`);
  }

  spawn(deviceId, params) {
    const serial = deviceId ? ['-s', deviceId] : [];
    return spawnAndLog(this.adbBin, [...serial, ...params]);
  }

  async listInstrumentation(deviceId) {
    return await this.shell(deviceId, 'pm list instrumentation');
  }

  instrumentationRunnerForBundleId(instrumentationRunners, bundleId) {
    const runnerForBundleRegEx = new RegExp(`^instrumentation:(.*) \\(target=${bundleId.replace(new RegExp('\\.', 'g'), "\\.")}\\)$`, 'gm');
    return _.get(runnerForBundleRegEx.exec(instrumentationRunners), [1], 'undefined');
  }

  async getInstrumentationRunner(deviceId, bundleId) {
    const instrumentationRunners = await this.listInstrumentation(deviceId);
    const instrumentationRunner = this.instrumentationRunnerForBundleId(instrumentationRunners, bundleId);
    if (instrumentationRunner === 'undefined') throw new Error(`No instrumentation runner found on device ${deviceId} for package ${bundleId}`);
    return instrumentationRunner;
  }
}

module.exports = ADB;
