import {exec, spawn} from "child-process-promise";
import log from "npmlog";
import retry from "./retry";

let _operationCounter = 0;

export async function execWithRetriesAndLogs(
    bin: string,
    options?: any,
    statusLogs?: any,
    retries: number = 10,
    interval: number = 1000,
) {
  _operationCounter++;

  let cmd: string;
  if (options) {
    cmd = `${options.prefix ? options.prefix + " && " : ""}${bin} ${options.args}`;
  } else {
    cmd = bin;
  }

  log.verbose(`${_operationCounter}: ${cmd}`);

  let result: any;
  await retry({retries, interval}, async () => {
    if (statusLogs && statusLogs.trying) {
      log.info(`${_operationCounter}: ${statusLogs.trying}`);
    }
    result = await exec(cmd);
  });

  if (result === undefined) {
    throw new Error(`${_operationCounter}: running "${cmd}" returned undefined`);
  }

  if (result.stdout) {
    log.verbose(`${_operationCounter}: stdout:`, result.stdout);
  }

  if (result.stderr) {
    log.verbose(`${_operationCounter}: stderr:`, result.stderr);
  }

  if (statusLogs && statusLogs.successful) {
    log.info(`${_operationCounter}: ${statusLogs.successful}`);
  }

  // if (result.childProcess.exitCode !== 0) {
  //   log.error(`${_operationCounter}: stdout:`, result.stdout);
  //   log.error(`${_operationCounter}: stderr:`, result.stderr);
  // }

  return result;
}

export function spawnAndLog(command: string, flags: string[]) {
  let out = "";
  let err = "";
  const result = spawn(command, flags, {stdio: ["ignore", "pipe", "pipe"], detached: true});

  log.verbose(`${command} ${flags.join(" ")}`);

  if (result.childProcess) {
    const {stdout, stderr} = result.childProcess;

    stdout.on("data", (chunk: string) => out += chunk.toString());
    stderr.on("data", (chunk: string) => err += chunk.toString());

    stdout.on("end", () => out && log.verbose("stdout:", out));
    stderr.on("end", () => err && log.verbose("stderr:", err));
  }

  return result;
}
