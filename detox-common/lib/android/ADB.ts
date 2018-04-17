import {execWithRetriesAndLogs, spawnAndLog} from "../utils/exec";

import _ from "lodash";
import path from "path";
import Environment from "../utils/environment";
import EmulatorTelnet from "./EmulatorTelnet";

export class ADB {

  private static readonly WAITING_INTERVAL = 2000;

  private adbBin: string = path.join(Environment.getAndroidSDKPath(), "platform-tools", "adb");

  public async devices() {
    const output = (await this.adbCmd("", "devices")).stdout;

    return await this.parseAdbDevicesConsoleOutput(output);
  }

  public async parseAdbDevicesConsoleOutput(input: string): Promise<any[]> {
    const outputToList = input.trim().split("\n");
    const devicesList = _.takeRight(outputToList, outputToList.length - 1);
    const devices = [];

    for (const deviceString of devicesList) {
      const deviceParams = deviceString.split("\t");
      const deviceAdbName = deviceParams[0];
      let device;
      if (this.isEmulator(deviceAdbName)) {
        const port = _.split(deviceAdbName, "-")[1];
        const telnet = new EmulatorTelnet();
        await telnet.connect(port);
        const name = await telnet.avdName();
        device = {type: "emulator", name, adbName: deviceAdbName, port};
        await telnet.quit();
      } else if (this.isGenymotion(deviceAdbName)) {
        device = {type: "genymotion", name: deviceAdbName, adbName: deviceAdbName};
      } else {
        device = {type: "device", name: deviceAdbName, adbName: deviceAdbName};
      }
      devices.push(device);
    }

    return devices;
  }

  public isEmulator(deviceAdbName: string): boolean {
    return _.includes(deviceAdbName, "emulator-");
  }

  public isGenymotion(deviceAdbName: string): boolean {
    return (/^((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:)){4}[0-9]{4}/.test(deviceAdbName));
  }

  public async install(deviceId: string, apkPath: string): Promise<void> {
    const apiLvl = await this.apiLevel(deviceId);
    if (apiLvl >= 24) {
      await this.adbCmd(deviceId, `install -r -g ${apkPath}`);
    } else {
      await this.adbCmd(deviceId, `install -rg ${apkPath}`);
    }
  }

  public async uninstall(deviceId: string, appId: string): Promise<void> {
    await this.adbCmd(deviceId, `uninstall ${appId}`);
  }

  public async terminate(deviceId: string, appId: string): Promise<void> {
    await this.shell(deviceId, `am force-stop ${appId}`);
  }

  public async unlockScreen(deviceId: string): Promise<void> {
    await this.shell(deviceId, `input keyevent 82`);
  }

  public async shell(deviceId: string, cmd: string): Promise<string> {
    return (await this.adbCmd(deviceId, `shell ${cmd}`)).stdout.trim();
  }

  public async waitForBootComplete(deviceId: string): Promise<boolean> {
    try {
      const bootComplete = await this.shell(deviceId, `getprop dev.bootcomplete`);

      if (bootComplete === "1") {
        return true;
      } else {
        await this.sleep(ADB.WAITING_INTERVAL);

        return await this.waitForBootComplete(deviceId);
      }
    } catch (ex) {
      await this.sleep(ADB.WAITING_INTERVAL);

      return await this.waitForBootComplete(deviceId);
    }
  }

  public async apiLevel(deviceId: string): Promise<number> {
    const lvl = await this.shell(deviceId, `getprop ro.build.version.sdk`);

    return Number(lvl);
  }

  public async adbCmd(deviceId: string, params: string): Promise<any> {
    const serial = `${deviceId ? `-s ${deviceId}` : ""}`;
    const cmd = `${this.adbBin} ${serial} ${params}`;

    return await execWithRetriesAndLogs(cmd, undefined, undefined, 1);
  }

  public async sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async getScreenSize(deviceId: string): Promise<{ width: number; height: number; }> {
    const {stdout} = await this.adbCmd(deviceId, `shell wm size`);
    const [width, height] = stdout.split(" ").pop().split("x");

    return {
      height: parseInt(height, 10),
      width: parseInt(width, 10),
    };
  }

  public async getFileSize(deviceId: string, filePath: string): Promise<number> {
    const {stdout} = await this.adbCmd(deviceId, `shell wc -c ${filePath}`);

    return parseInt(stdout, 10);
  }

  public screencap(deviceId: string, saveFilePath: string) {
    return this.adbCmd(deviceId, `shell screencap ${saveFilePath}`);
  }

  public screenrecord(deviceId: string, saveFilePath: string, width: number, height: number) {
    const params = width && height ? ["--size", `${width}x${height}`] : [];

    return this.spawn(deviceId, ["shell", "screenrecord", ...params, saveFilePath]);
  }

  public pull(deviceId: string, src: string, dst = "") {
    return this.adbCmd(deviceId, `pull "${src}" "${dst}"`);
  }

  public rm(deviceId: string, filePath: string, force = false) {
    return this.adbCmd(deviceId, `shell rm ${force ? "-f" : ""} "${filePath}"`);
  }

  public spawn(deviceId: string, params: string[]) {
    const serial = deviceId ? ["-s", deviceId] : [];

    return spawnAndLog(this.adbBin, [...serial, ...params]);
  }
}

export default ADB;
