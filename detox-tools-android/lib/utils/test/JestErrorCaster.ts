import _ from 'lodash';
import {DetoxChildProcessError} from "../../errors/DetoxChildProcessError";
import {DetoxRuntimeError} from "../../errors/DetoxRuntimeError";

export class JestErrorCaster {
    public wrap(functionThatWillThrow: () => any): () => any {
        return () => {
            try {
                functionThatWillThrow();
            } catch (e) {
                this._rethrowAsSimpleError(e);
            }
        };
    }

    private _rethrowAsSimpleError(e: any): never {
        const simpleError = this.toSimpleError(e);
        throw simpleError;
    }

    public toSimpleError(e: any): Error {
        if (!e) {
            return new Error();
        }

        if (e instanceof DetoxChildProcessError) {
            return new Error(this._formatChildProcessErrorMessage(e));
        }

        if (e instanceof DetoxRuntimeError) {
            return new Error(this._formatRuntimeErrorMessage(e));
        }

        if (_.isError(e)) {
            debugger;
            return e;
        }

        return new Error(e.toString());
    }

    private _formatChildProcessErrorMessage(e: DetoxChildProcessError): string {
        const hint1 = 'To reproduce the error, run the following command:';
        const hint2 = e.error ? 'See exception below:\n' + e.error.toString() : '';
        let hint3 = (e.stdout || e.stderr) ? 'You might find these dumps from stdout and stderr helpful. See below:' : '';
        hint3 = hint3 ? hint3 + '\n' + ('='.repeat(hint3.length)) : '';


        return _.compact([
            e.message,
            hint1,
            e.command,
            hint2,
            hint3,
            e.stdout,
            e.stderr,
        ]).join('\n');
    }

    private _formatRuntimeErrorMessage(e: DetoxRuntimeError): string {
        const hint = e.hint ? 'HINT: ' + e.hint : '';
        const debugInfo = e.debugInfo ? 'See more debug information below:\n' + e.debugInfo : '';

        return _.compact([
            e.message,
            hint,
            debugInfo
        ]).join('\n');
    }
}

export default new JestErrorCaster();
