export class DetoxRuntimeError extends Error {
    public readonly hint: string;
    public readonly debugInfo: string;

    constructor(options: {
        message: string;
        hint?: string;
        debugInfo?: string;
    }) {
        super(options.message);
        this.hint = options.hint || "";
        this.debugInfo = options.debugInfo || "";
    }
}
