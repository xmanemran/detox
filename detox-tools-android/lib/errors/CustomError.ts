export class CustomError extends Error {
  constructor(message?: string) {
    super(message);

    Object.defineProperty(this, "name", {
      value: this.constructor.name,
    });

    Error.stackTraceLimit = 0;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
