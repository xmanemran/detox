const _ = require('lodash');
const EmulatorTelnet = require('./EmulatorTelnet');

import _ from 'lodash';
import fs from 'fs';
import {exec} from 'child-process-promise';
import {DetoxRuntimeError} from "./errors/DetoxRuntimeError";
import {DetoxChildProcessError} from "./errors/DetoxChildProcessError";
import {isChildProcessError} from "./utils/isChildProcessError";

class ADB {

  constructor(config) {
    this.adbBin = config.adbBin;
    this.logger = config.logger;
    this.deviceId = config.deviceId;
    this.cpm = config.childProcessManager;

    this._apiLevelPromise = null;
  }

  // forDevice(deviceId) {
  //   return new ADB({
  //     adbBin: this.adbBin,
  //     childProcessManager: this.cpm,
  //     deviceId,
  //   });
  // }

  async devices() {
    const devices = await this.adbCmd('devices');
    return this._parseAdbDevicesConsoleOutput(devices.stdout);
  }

  async _parseAdbDevicesConsoleOutput(input) {
    const outputToList = input.trim().split('\n');
    const devicesList = _.takeRight(outputToList, outputToList.length - 1);
    const devices = [];
    for (const deviceString of devicesList) {
      const deviceParams = deviceString.split('\t');
      const deviceAdbName = deviceParams[0];
      let device;
      if (this._isEmulator(deviceAdbName)) {
        const port = _.split(deviceAdbName, '-')[1];
        const telnet = new EmulatorTelnet();
        await telnet.connect(port);
        const name = await telnet.avdName();
        device = {type: 'emulator', name: name, adbName: deviceAdbName, port: port};
        await telnet.quit();
      } else if (this._isGenymotion(deviceAdbName)) {
        device = {type: 'genymotion', name: deviceAdbName, adbName: deviceAdbName};
      } else {
        device = {type: 'device', name: deviceAdbName, adbName: deviceAdbName};
      }
      devices.push(device);
    }
    return devices;
  }

  _isEmulator(deviceAdbName) {
    return _.includes(deviceAdbName, 'emulator-');
  }

  _isGenymotion(deviceAdbName) {
    return (/^((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:)){4}[0-9]{4}/.test(deviceAdbName));
  }

  async install({ apkPath }) {
    const apiLvl = await this.apiLevel();
    if (apiLvl >= 24) {
      await this.adbDeviceCmd(`install -r -g ${apkPath}`);
    } else {
      await this.adbDeviceCmd(`install -rg ${apkPath}`);
    }
  }

  async uninstall({ appId }) {
    await this.adbDeviceCmd(`uninstall ${appId}`);
  }

  async terminate({ appId }) {
    await this.shell(`am force-stop ${appId}`);
  }

  async unlockScreen() {
    await this.shell(`input keyevent 82`);
  }

  async shell(cmd) {
    return (await this.adbDeviceCmd(`shell ${cmd}`)).stdout.trim();
  }

  async getScreenSize() {
    const size = await this.shell('wm size');
    const [width, height] = size.split(' ').pop().split('x');

    return {
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    };
  }

  async getFileSize(path) {
    const sizeString = await this.shell(`wc -c ${path}`);
    return parseInt(sizeString, 10);
  }

  screencap({ path }) {
    return this.adbDeviceCmd(`shell screencap ${path}`); // TODO:
  }

  screenrecord({ size, bitRate, timeLimit, verbose, path }) {
    const args = [];

    if (Array.isArray(size)) {
      const [width, height] = size;

      if (width && height) {
        args.push('--size');
        args.push(width + 'x' + height);
      }
    }

    if (bitRate > 0) {
      args.push('--bit-rate');
      args.push(String(bitRate));
    }

    if (timeLimit > 0) {
      args.push('--time-limit');
      args.push(String(timeLimit));
    }

    if (verbose) {
      args.push('--verbose');
    }

    return this.spawn(['shell', 'screenrecord', ...args, path]);
  }

  pull({ source, destination }) {
    return this.adbDeviceCmd(`pull "${source}" "${destination}"`);
  }

  async waitForBootComplete() {
    try {
      const bootComplete = await this.shell(`getprop dev.bootcomplete`);

      if (bootComplete === '1') {
        return true;
      } else {
        await this._sleep(2000);
        return this.waitForBootComplete();
      }
    } catch (ex) {
      await this._sleep(2000);
      return this.waitForBootComplete();
    }
  }

  async _sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async apiLevel() {
    if (!this._apiLevelPromise) {
      this._apiLevelPromise = await this.shell('getprop ro.build.version.sdk').then(Number);
    }

    return this._apiLevelPromise;
  }

  async adbDeviceCmd(argsString) {
    return this.adbCmd(`-s ${this.deviceId} ` + argsString);
  }

  async adbCmd(argsString) {
    const cmd = `${this.adbBin} ${argsString}`;
    return this.cpm.exec(cmd, undefined, undefined, 1);
  }

  async spawn(args) {
    const serial = this.deviceId ? ['-s', this.deviceId] : [];
    return this.cpm.spawn(this.adbBin, [...serial, ...args]);
  }

  async listInstrumentation() {
    return this.shell('pm list instrumentation');
  }

  instrumentationRunnerForBundleId(instrumentationRunners, bundleId) {
    const runnerForBundleRegEx = new RegExp(`^instrumentation:(.*) \\(target=${bundleId.replace(new RegExp('\\.', 'g'), "\\.")}\\)$`, 'gm');
    return _.get(runnerForBundleRegEx.exec(instrumentationRunners), [1], 'undefined');
  }

  async getInstrumentationRunner({ bundleId }) {
    const instrumentationRunners = await this.listInstrumentation();
    const instrumentationRunner = this.instrumentationRunnerForBundleId(instrumentationRunners, bundleId);
    if (instrumentationRunner === 'undefined') {
      throw new Error(`No instrumentation runner found on device ${this.deviceId} for package ${bundleId}`);
    }

    return instrumentationRunner;
  }
}

AAPT.PACKAGE_REGEXP = /package: name='([^']+)'/g;


module.exports = ADB;
