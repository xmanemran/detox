import child_process_promise from "child-process-promise";
import fs from "fs";
import _ from "lodash";
import log from "npmlog";
import path from "path";
import {Tail} from "tail";
import Environment from "../utils/environment";
import {execWithRetriesAndLogs as exec} from "../utils/exec";

const spawn = child_process_promise.spawn;

export class Emulator {
    private emulatorBin: string = path.join(Environment.getAndroidSDKPath(), "tools", "emulator");

    public async listAvds(): Promise<string[]> {
        const output: string = await this.exec(`-list-avds --verbose`);
        const avds = output.trim().split("\n");

        return avds;
    }

    public async exec(cmd: string): Promise<string> {
        return (await exec(`${this.emulatorBin} ${cmd}`)).stdout;
    }

    public async boot(emulatorName: string) {
        const cmd = `-verbose -gpu host -no-audio @${emulatorName}`;
        log.verbose(this.emulatorBin, cmd);
        const tempLog = `./${emulatorName}.log`;
        const stdout = fs.openSync(tempLog, "a");
        const stderr = fs.openSync(tempLog, "a");

        const tail = new Tail(tempLog);
        const promise = spawn(this.emulatorBin, _.split(cmd, " "), {detached: true, stdio: ["ignore", stdout, stderr]});

        const childProcess = promise.childProcess;
        childProcess.unref();

        tail.on("line", function(data) {
            if (data.includes("Adb connected, start proxing data")) {
                detach();
            }
            if (data.includes(`There's another emulator instance running with the current AVD`)) {
                detach();
            }
        });

        tail.on("error", (error: any) => {
            detach();
            log.verbose("Emulator stderr: ", error);
        });

        promise.catch((err: any) => {
            log.error("Emulator ERROR: ", err);
        });

        function detach() {
            tail.unwatch();
            fs.closeSync(stdout);
            fs.closeSync(stderr);
            fs.unlink(tempLog, () => {});
            promise._cpResolve();
        }

        return promise;
    }
}

export default Emulator;
