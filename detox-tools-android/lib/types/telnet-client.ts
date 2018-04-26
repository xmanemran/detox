declare module "telnet-client" {
    export = Telnet;

    class Telnet {
        public connect(params: {
            host: string;
            port: string;
            shellPrompt: RegExp;
            timeout: number;
            execTimeout: number;
            sendTimeout: number;
            echoLines: number;
            stripShellPrompt: boolean;
        }): void;

        public exec(command: string): Promise<string>;

        public shell(callback: (error: any, stream: NodeJS.WritableStream) => any): void;

        public destroy(): void;
        public end(): void;
    }
}
