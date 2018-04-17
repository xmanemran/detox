declare interface IExecModule {
    execWithRetriesAndLogs(bin: any, options: any, statusLogs: any, retries?: number, interval?: number): Promise<any>;
    spawnAndLog(command: string, flags: string): any;
}
