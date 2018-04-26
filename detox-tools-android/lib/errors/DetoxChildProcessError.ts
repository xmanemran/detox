export class DetoxChildProcessError extends Error {
    public readonly command: string;
    public readonly error: Error | null;
    public readonly stdout: string;
    public readonly stderr: string;

    constructor(options: {
        command?: string;
        error?: Error;
        code?: number;
        message?: string;
        stdout?: string;
        stderr?: string;
    }) {
        super(options.message || `Command failed with an error code (${options.code})`);
        this.command = options.command || "";
        this.stdout = options.stdout || "";
        this.stderr = options.stderr || "";
        this.error = options.error || null;
    }
}
