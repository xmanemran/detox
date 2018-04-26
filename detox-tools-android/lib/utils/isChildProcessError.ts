import {IChildProcessError} from "child-process-promise";

export function isChildProcessError(error: Error): error is IChildProcessError {
    return "stdout" in error && "stderr" in error && "code" in error;
}
