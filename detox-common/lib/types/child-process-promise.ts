declare module "child-process-promise" {
    export function exec(...args: any[]): Promise<any>;
    export function spawn(...args: any[]): any;
}