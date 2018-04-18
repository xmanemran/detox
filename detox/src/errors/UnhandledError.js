class UnhandledError extends Error {
    constructor(message, innerError) {
        super(message);
        this.innerError = innerError;
    }
}

module.exports = UnhandledError;
