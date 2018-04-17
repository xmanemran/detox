import _ from "lodash";
import * as exec from "../utils/exec";
import tempfile from "tempfile";
import environment from "../utils/environment";
import retry from "../utils/retry";

export class AppleSimUtils {

  public async setPermissions(udid: string, bundleId: string, permissionsObj: Record<string, string>): Promise<void> {
    const statusLogs = {
      trying: `Trying to set permissions...`,
      successful: "Permissions are set"
    };

    const permissions: string[] = [];
    _.forEach(permissionsObj, function (shouldAllow, permission) {
      permissions.push(permission + "=" + shouldAllow);
    });

    await this._execAppleSimUtils({
      args: `--simulator ${udid} --bundle ${bundleId} --setPermissions ${_.join(permissions, ",")}`
    }, statusLogs, 1);
  }

  public async findDeviceUDID(query: string): Promise<string> {
    const statusLogs = {
      trying: `Searching for device matching ${query}...`
    };
    const correctQuery = this._correctQueryWithOS(query);
    const response = await this._execAppleSimUtils({ args: `--list "${correctQuery}" --maxResults=1` }, statusLogs, 1);
    const parsed = this._parseResponseFromAppleSimUtils(response);
    const udid = _.get(parsed, [0, "udid"]);
    if (!udid) {
      throw new Error(`Can't find a simulator to match with "${query}", run 'xcrun simctl list' to list your supported devices.
      It is advised to only state a device type, and not to state iOS version, e.g. "iPhone 7"`);
    }

    return udid;
  }

  public async findDeviceByUDID(udid: string): Promise<any> {
    const response = await this._execAppleSimUtils({ args: `--list` }, undefined, 1);
    const parsed = this._parseResponseFromAppleSimUtils(response);

    const device = _.find(parsed, (device) => _.isEqual(device.udid, udid));
    if (!device) {
      throw new Error(`Can't find device ${udid}`);
    }

    return device;
  }

  public async waitForDeviceState(udid: string, state: string): Promise<any> {
    let device;

    await retry({ retries: 10, interval: 1000 }, async () => {
      device = await this.findDeviceByUDID(udid);
      if (!_.isEqual(device.state, state)) {
        throw new Error(`device is in state '${device.state}'`);
      }
    });

    return device;
  }

  public async boot(udid: string): Promise<boolean | undefined> {
    const device = await this.findDeviceByUDID(udid);
    if (_.isEqual(device.state, "Booted") || _.isEqual(device.state, "Booting")) {
      return false;
    }

    await this.waitForDeviceState(udid, "Shutdown");
    await this._bootDeviceByXcodeVersion(udid);
    await this.waitForDeviceState(udid, "Booted");

    return (void 0);
  }

  public async install(udid: string, absPath: string): Promise<void> {
    const statusLogs = {
      trying: `Installing ${absPath}...`,
      successful: `${absPath} installed`
    };
    await this._execSimctl({ cmd: `install ${udid} "${absPath}"`, statusLogs });
  }

  public async uninstall(udid: string, bundleId: string): Promise<void> {
    const statusLogs = {
      trying: `Uninstalling ${bundleId}...`,
      successful: `${bundleId} uninstalled`
    };

    try {
      await this._execSimctl({ cmd: `uninstall ${udid} ${bundleId}`, statusLogs });
    } catch (e) {
      // that's fine
    }
  }

  public async launch(udid: string, bundleId: string, launchArgs: string[]) {
    const frameworkPath = await environment.getFrameworkPath();
    const logsInfo = new LogsInfo(udid);
    const args = this._joinLaunchArgs(launchArgs);

    const result = await this._launchMagically(frameworkPath, logsInfo, udid, bundleId, args);
    return this._parseLaunchId(result);
  }

  public async sendToHome(udid: string): Promise<void> {
    await this._execSimctl({ cmd: `launch ${udid} com.apple.springboard`, retries: 10 });
  }

  public getLogsPaths(udid: string) {
    const logsInfo = new LogsInfo(udid);

    return {
      stdout: logsInfo.absStdout,
      stderr: logsInfo.absStderr
    };
  }

  public async terminate(udid: string, bundleId: string): Promise<void> {
    const statusLogs = {
      trying: `Terminating ${bundleId}...`,
      successful: `${bundleId} terminated`
    };

    await this._execSimctl({ cmd: `terminate ${udid} ${bundleId}`, statusLogs });
  }

  public async shutdown(udid: string): Promise<void> {
    const statusLogs = {
      trying: `Shutting down ${udid}...`,
      successful: `${udid} shut down`
    };
    await this._execSimctl({ cmd: `shutdown ${udid}`, statusLogs });
  }

  public async openUrl(udid: string, url: string): Promise<void> {
    await this._execSimctl({ cmd: `openurl ${udid} ${url}` });
  }

  public async setLocation(udid: string, lat: string, lon: string): Promise<void> {
    const result = await exec.execWithRetriesAndLogs(`which fbsimctl`, undefined, undefined, 1);
    if (_.get(result, "stdout")) {
      await exec.execWithRetriesAndLogs(`fbsimctl ${udid} set_location ${lat} ${lon}`, undefined, undefined, 1);
    } else {
      throw new Error(`setLocation currently supported only through fbsimctl.
      Install fbsimctl using:
      "brew tap facebook/fb && export CODE_SIGNING_REQUIRED=NO && brew install fbsimctl"`);
    }
  }

  public async resetContentAndSettings(udid: string): Promise<void> {
    await this.shutdown(udid);
    await this._execSimctl({ cmd: `erase ${udid}` });
    await this.boot(udid);
  }

  public async getXcodeVersion(): Promise<number> {
    const raw = await exec.execWithRetriesAndLogs(`xcodebuild -version`, undefined, undefined, 1);
    const stdout = _.get(raw, "stdout", "undefined");
    const match = /^Xcode (\S+)\.*\S*\s*/.exec(stdout);
    const majorVersion = parseInt(_.get(match, "[1]"));
    if (!_.isInteger(majorVersion) || majorVersion < 1) {
      throw new Error(`Can't read Xcode version, got: '${stdout}'`);
    }
    return majorVersion;
  }

  public async takeScreenshot(udid: string) {
    const dest = tempfile(".png");
    await this._execSimctl({cmd: `io ${udid} screenshot ${dest}`});
    return dest;
  }

  public startVideo(udid: string) {
    const dest = tempfile(".mp4");
    const promise = exec.spawnAndLog("/usr/bin/xcrun", ["simctl", "io", udid, "recordVideo", dest]);
    const process = promise.childProcess;

    return {promise, process, dest};
  }

  public stopVideo(_udid: string, {promise, process, dest}: {promise: Promise<any>; process: NodeJS.Process; dest: string; }): Promise<string> {
    return new Promise((resolve) => {
      promise.then(() => resolve(dest));
      process.kill(2);
    });
  }

  public async _execAppleSimUtils(options: any, statusLogs: any, retries: number, interval?: number) {
    const bin = `applesimutils`;

    return await exec.execWithRetriesAndLogs(bin, options, statusLogs, retries, interval);
  }

  public async _execSimctl(options: { cmd: string; statusLogs?: any; retries?: number; }) {
    const { cmd, statusLogs = {}, retries = 1 } = options;

    return await exec.execWithRetriesAndLogs(`/usr/bin/xcrun simctl ${cmd}`, undefined, statusLogs, retries);
  }

  public _correctQueryWithOS(query: string) {
    let correctQuery = query;
    if (_.includes(query, ",")) {
      const parts = _.split(query, ",");
      correctQuery = `${parts[0].trim()}, OS=${parts[1].trim()}`;
    }
    return correctQuery;
  }

  public _parseResponseFromAppleSimUtils(response: any): any {
    let out = _.get(response, "stdout");
    if (_.isEmpty(out)) {
      out = _.get(response, "stderr");
    }
    if (_.isEmpty(out)) {
      return undefined;
    }

    let parsed;
    try {
      parsed = JSON.parse(out);

    } catch (ex) {
      throw new Error(`Could not parse response from applesimutils, please update applesimutils and try again.
      'brew uninstall applesimutils && brew tap wix/brew && brew install applesimutils'`);
    }
    return parsed;
  }

  public async _bootDeviceByXcodeVersion(udid: string) {
    const xcodeVersion = await this.getXcodeVersion();
    if (xcodeVersion >= 9) {
      const statusLogs = { trying: `Booting device ${udid}` };
      await this._execSimctl({ cmd: `boot ${udid}`, statusLogs, retries: 10 });
    } else {
      await this._bootDeviceMagically(udid);
    }
  }

  public async _bootDeviceMagically(udid: string) {
    const cmd = "/bin/bash -c '`xcode-select -p`/Applications/Simulator.app/Contents/MacOS/Simulator " +
      `--args -CurrentDeviceUDID ${udid} -ConnectHardwareKeyboard 0 ` +
      "-DeviceSetPath $HOME/Library/Developer/CoreSimulator/Devices > /dev/null 2>&1 < /dev/null &'";
    await exec.execWithRetriesAndLogs(cmd, undefined, { trying: `Launching device ${udid}...` }, 1);
  }

  public _joinLaunchArgs(launchArgs: string[]): string {
    return _.map(launchArgs, (v, k) => `${k} ${v}`).join(" ").trim();
  }

  public async _launchMagically(frameworkPath: string, logsInfo: LogsInfo, udid: string, bundleId: string, args: string) {
    const statusLogs = {
      trying: `Launching ${bundleId}...`,
      successful: `${bundleId} launched. The stdout and stderr logs were recreated, you can watch them with:\n` +
      `        tail -F ${logsInfo.absJoined}`
    };

    const launchBin = `/bin/cat /dev/null >${logsInfo.absStdout} 2>${logsInfo.absStderr} && ` +
      `SIMCTL_CHILD_DYLD_INSERT_LIBRARIES="${frameworkPath}/Detox" ` +
      `/usr/bin/xcrun simctl launch --stdout=${logsInfo.simStdout} --stderr=${logsInfo.simStderr} ` +
      `${udid} ${bundleId} --args ${args}`;

    return await exec.execWithRetriesAndLogs(launchBin, undefined, statusLogs, 1);
  }

  public _parseLaunchId(result: any): number {
    return parseInt(_.get(result, "stdout", ":").trim().split(":")[1]);
  }
}

export class LogsInfo {
    public readonly simStdout: string;
    public readonly simStderr: string;
    public readonly absStdout: string;
    public readonly absStderr: string;
    public readonly absJoined: string;

    constructor(udid: string) {
        const logPrefix = "/tmp/detox.last_launch_app_log.";
        const simDataRoot = `$HOME/Library/Developer/CoreSimulator/Devices/${udid}/data`;

        this.simStdout = logPrefix + "out";
        this.simStderr = logPrefix + "err";
        this.absStdout = simDataRoot + this.simStdout;
        this.absStderr = simDataRoot + this.simStderr;
        this.absJoined = `${simDataRoot}${logPrefix}{out,err}`;
    }
}

export default AppleSimUtils;
