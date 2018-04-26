import _ from 'lodash';
import fs from 'fs';
import {exec} from 'child-process-promise';
import {DetoxRuntimeError} from "./errors/DetoxRuntimeError";
import {DetoxChildProcessError} from "./errors/DetoxChildProcessError";
import {isChildProcessError} from "./utils/isChildProcessError";

export type AAPTOptions = {
    aaptBin: string;
};

export class AAPT {
    private static readonly PACKAGE_REGEXP = /package: name='([^']+)'/g;

    private readonly aaptBin: string;

    constructor(options: AAPTOptions) {
        this._assertOptionsAreNotEmpty(options);
        this._assertBinaryPathIsNotEmpty(options);
        this._assertBinaryPathExists(options);

        this.aaptBin = options.aaptBin;
    }

    /**
     * @see {@link https://stackoverflow.com/a/6289168}
     */
    public async readPackageNameFromAPK(apkPath: string): Promise<string> {
        this._assertApkPathIsNotEmpty(apkPath);

        const aapt = this.aaptBin;
        const command = `${aapt} dump badging "${apkPath}"`;

        const process = await exec(command).catch(e => e);
        if (_.isError(process)) {
            this._rethrowChildProcessError(process, command);
        }

        const packageName = AAPT.PACKAGE_REGEXP.exec(process.stdout);
        if (!packageName) {
            throw new DetoxChildProcessError({
                message: 'could not find the package name in aapt stdout',
                command,
                stdout: process.stdout,
                stderr: process.stderr,
            });
        }

        return packageName[1];
    }

    private _assertOptionsAreNotEmpty(options: AAPTOptions): void | never {
        if (!options) {
            throw new DetoxRuntimeError({
                message: `${AAPT.name}.constructor() did not receive any options`,
                hint: `Make sure you are passing non-empty options to new ${AAPT.name}(options)`,
            });
        }
    }

    private _assertBinaryPathIsNotEmpty(options: AAPTOptions): void | never {
        if (!options.aaptBin) {
            throw new DetoxRuntimeError({
                message: `${AAPT.name}.constructor(options) did not get binary path of *aapt*`,
                hint: `Options passed to constructor were: ${JSON.stringify(options)}`,
            });
        }
    }

    private _assertBinaryPathExists(options: AAPTOptions): void | never {
        if (!fs.existsSync(options.aaptBin)) {
            throw new DetoxRuntimeError({
                message: `*aapt* binary was not found`,
                hint: `Make sure it exists at path: ${options.aaptBin}`,
            });
        }
    }

    private _assertApkPathIsNotEmpty(apkPath: string): void | never {
        if (!apkPath) {
            throw new DetoxRuntimeError({
                message: 'No path to APK file is specified',
                hint: 'Make sure that AAPT.readPackageNameFromAPK(apkPath) gets valid path.'
            });
        }
    }

    private _rethrowChildProcessError(error: Error, command: string): void {
        /* istanbul ignore next */
        if (!isChildProcessError(error)) { // NOTE: this is a currently impossible case, but let's leave this check
            throw new DetoxChildProcessError({
                message: error.message,
                command,
                error,
            });
        }

        throw new DetoxChildProcessError({
            command,
            code: error.code,
            stdout: error.stdout,
            stderr: error.stderr,
        });
    }
}

