export class AndroidArtifact {
    private readonly _source: string;
    private readonly _adb: any;
    private readonly _deviceId: string;

    constructor(source: string, adb: any, deviceId: string) {
        this._source = source;
        this._adb = adb;
        this._deviceId = deviceId;
    }

    toString() {
        return this._source;
    }

    async copy(destination: string) {
        await this._adb.pull(this._deviceId, this._source, destination);
    }

    async move(destination: string) {
        await this.copy(destination);
        await this.remove();
    }

    async remove() {
        await this._adb.rm(this._deviceId, this._source, true);
    }
}
