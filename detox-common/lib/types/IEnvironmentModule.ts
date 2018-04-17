declare interface IEnvironmentModule {
    getDetoxVersion(): string;
    getFrameworkPath(): Promise<string>;
    getAndroidSDKPath(): string;
}
