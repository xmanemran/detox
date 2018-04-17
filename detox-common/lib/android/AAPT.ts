const _ = require("lodash");
const exec = require("child-process-promise").exec;
const Environment = require("../utils/environment");
const path = require("path");
const fsext = require("../utils/fsext");

export class AAPT {
  private aaptBin: string | null = null;

  public async _prepare() {
    if (!this.aaptBin) {
      const sdkPath = Environment.getAndroidSDKPath();
      const buildToolsDirs = await fsext.getDirectories(path.join(sdkPath, "build-tools"));
      const latestBuildToolsVersion = _.last(buildToolsDirs);
      this.aaptBin = path.join(sdkPath, "build-tools", latestBuildToolsVersion, "aapt");
    }
  }

  public async getPackageName(apkPath: string) {
    await this._prepare();

    const process = await exec(`${this.aaptBin} dump badging "${apkPath}"`);
    const packageName = new RegExp(/package: name='([^']+)'/g).exec(process.stdout);

    if (!packageName) {
      throw new Error("packageName is null");
    }

    return packageName[1];
  }
}

export default AAPT;
