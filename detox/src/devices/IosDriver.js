const path = require('path');
const fs = require('fs');
const DeviceDriverBase = require('./DeviceDriverBase');
const InvocationManager = require('../invoke').InvocationManager;
const invoke = require('../invoke');
const GREYConfigurationApi = require('./../ios/earlgreyapi/GREYConfiguration');
const GREYConfigurationDetox = require('./../ios/earlgreyapi/GREYConfigurationDetox');
const EarlyGrey = require('./../ios/earlgreyapi/EarlGrey');

class IosDriver extends DeviceDriverBase {
  constructor(client) {
    super(client);

    this.expect = require('../ios/expect');
    this.expect.setInvocationManager(new InvocationManager(client));
  }

  exportGlobals() {
    this.expect.exportGlobals();
  }

  createPayloadFile(notification) {
    const notificationFilePath = path.join(this.createRandomDirectory(), `payload.json`);
    fs.writeFileSync(notificationFilePath, JSON.stringify(notification, null, 2));
    return notificationFilePath;
  }

  async setURLBlacklist(urlList) {
    await this.client.execute(
      GREYConfigurationApi.setValueForConfigKey(
        GREYConfigurationApi.sharedInstance(),
        urlList,
        "GREYConfigKeyURLBlacklistRegex"
      )
    );
  }

  async enableSynchronization() {
    await this.client.execute(
      GREYConfigurationDetox.enableSynchronization(
        GREYConfigurationApi.sharedInstance()
      )
    );
  }

  async disableSynchronization() {
    await this.client.execute(
      GREYConfigurationDetox.disableSynchronization(
        GREYConfigurationApi.sharedInstance()
      )
    );
  }

  async shake(deviceId) {
    return await this.client.shake();
  }

  async setOrientation(deviceId, orientation) {
    const call = invoke.callDirectly(EarlyGrey.rotateDeviceToOrientationErrorOrNil(invoke.EarlGrey.instance,orientation,null));
    await this.client.execute(call);
  }

  defaultLaunchArgsPrefix() {
    return '-';
  }

  validateDeviceConfig(config) {
    //no validation
  }

  getPlatform() {
    return 'ios';
  }
}

module.exports = IosDriver;
