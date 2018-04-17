declare module "telnet-client" {
    export = Telnet;

    class Telnet {
        connect(params: {
            host: string;
            port: string;
            shellPrompt: RegExp;
            timeout: number;
            execTimeout: number;
            sendTimeout: number;
            echoLines: number;
            stripShellPrompt: boolean;
        }): void;

        exec(command: string): Promise<string>;

        shell(callback: (error: any, stream: NodeJS.WritableStream) => any): void;

        destroy(): void;
        end(): void;
    }
}