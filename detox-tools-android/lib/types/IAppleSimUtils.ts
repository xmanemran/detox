declare interface AppleSimUtilsVideoObject {
    promise: Promise<any>;
    process: NodeJS.Process;
    dest: string;
}

declare interface IAppleSimUtils {
    setPermissions(udid: string, bundleId: string, permissionsObj: Record<string, string>): Promise<void>;
    findDeviceUDID(query: string): Promise<string>;
    findDeviceByUDID(udid: string): Promise<any>;
    waitForDeviceState(udid: string, state: string): Promise<any>;
    boot(udid: string): Promise<boolean | undefined>;
    install(udid: string, absPath: string): Promise<void>;
    uninstall(udid: string, bundleId: string): Promise<void>;
    launch(udid: string, bundleId: string, launchArgs: string[]): Promise<number>;
    sendToHome(udid: string): Promise<void>;
    getLogsPaths(udid: string): { stdout: string; stderr: string; };
    terminate(udid: string, bundleId: string): Promise<void>;
    shutdown(udid: string): Promise<void>;
    openUrl(udid: string, url: string): Promise<void>;
    setLocation(udid: string, lat: string, lon: string): Promise<void>;
    resetContentAndSettings(udid: string): Promise<void>;
    getXcodeVersion(): Promise<number>;
    takeScreenshot(udid: string): Promise<any>;
    startVideo(udid: string): AppleSimUtilsVideoObject;
    stopVideo(_udid: string, videoObject: AppleSimUtilsVideoObject): Promise<string>;
// _execAppleSimUtils(options: any, statusLogs: any, retries: number, interval?: number);
// _execSimctl(options: { cmd: string; statusLogs?: any; retries?: number; });
// _correctQueryWithOS(query: string);
// _parseResponseFromAppleSimUtils(response: any): any;
// _bootDeviceByXcodeVersion(udid: string);
// _bootDeviceMagically(udid: string);
// _joinLaunchArgs(launchArgs: string[]): string;
// _launchMagically(frameworkPath: string, logsInfo: LogsInfo, udid: string, bundleId: string, args: string);
// _parseLaunchId(result: any): number;
}
