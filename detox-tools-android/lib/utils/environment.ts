// @ts-ignore
import cpp from "child-process-promise";
import os from "os";
import path from "path";

const exec: (cmd: string) => Promise<any> = cpp.exec;

// public async _prepare() {
//   if (!this.aaptBin) {
//     const sdkPath = Environment.getAndroidSDKPath();
//     const buildToolsDirs = await fsext.getDirectories(path.join(sdkPath, "build-tools"));
//     const latestBuildToolsVersion = _.last(buildToolsDirs);
//     this.aaptBin = path.join(sdkPath, "build-tools", latestBuildToolsVersion, "aapt");
//   }
// }

const Environment: IEnvironmentModule = {
    getDetoxVersion() {
        return require(path.join(__dirname, "../../package.json")).version;
    },
    async getFrameworkPath() {
        // tslint:disable-next-line
        const detoxVersion = this.getDetoxVersion();
        const sha1 = (await exec(`(echo "${detoxVersion}" && xcodebuild -version) | shasum | awk '{print $1}'`))
            .stdout.trim();

        return `${os.homedir()}/Library/Detox/ios/${sha1}/Detox.framework`;
    },
    getAndroidSDKPath() {
        const sdkPath = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME;
        if (!sdkPath) {
            // tslint:disable-next-line
            throw new Error(`$ANDROID_SDK_ROOT is not defined, set the path to the SDK installation directory into $ANDROID_SDK_ROOT,
          Go to https://developer.android.com/studio/command-line/variables.html for more details`);
        }

        return sdkPath;
    },
} as IEnvironmentModule;

export default Environment;
