declare module "child-process-promise" {
    export interface IChildProcessModule {
        exec(...args: any[]): Promise<any>;
        spawn(...args: any[]): any;
    }

    export const exec: IChildProcessModule["exec"];
    export const spawn: IChildProcessModule["spawn"];

    export interface IChildProcessError extends Error {
        readonly code: number;
        readonly stdout: string;
        readonly stderr: string;
    }
}
