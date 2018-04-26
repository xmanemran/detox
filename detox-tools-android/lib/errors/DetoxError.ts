export class DetoxError extends Error {
  constructor(message?: string) {
    super(message);
    Error.stackTraceLimit = 0;

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

export default DetoxError;
