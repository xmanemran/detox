import fs from "fs-extra";
import os from "os";
import path from "path";
import Telnet from "telnet-client";

export class EmulatorTelnet {
  private connection = new Telnet();

  public async connect(port: string) {
    const params = {
      host: "localhost",
      port,
      shellPrompt: /^OK$/m,
      timeout: 1500,
      execTimeout: 1500,
      sendTimeout: 1500,
      echoLines: -2,
      stripShellPrompt: true,
    };

    await this.connection.connect(params);
    const auth = await fs.readFile(path.join(os.homedir(), ".emulator_console_auth_token"), "utf8");
    await this.exec(`auth ${auth}`);
  }

  public async exec(command: string) {
    let res = await this.connection.exec(`${command}`);
    res = res.split("\n")[0];
    return res;
  }

  public async shell(command: string) {
    return new Promise((resolve) => {
      this.connection.shell((_error, stream) => {
        stream.write(`${command}\n`);
        stream.on("data", (data) => {
          const result = data.toString();
          if (result.includes("\n")) {
            resolve(result);
          }
        },
        );
      });
    });
  }

  public async avdName() {
    return await this.exec("avd name");
  }

  public async kill() {
    await this.shell("kill");
    await this.quit();
  }

  public async quit() {
    await this.connection.end();
    await this.connection.destroy();
  }

  public async rotate() {
    return await this.shell("rotate");
  }
}

export default EmulatorTelnet;
