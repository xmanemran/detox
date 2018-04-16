import {AndroidArtifact} from "./AndroidArtifact";

export class AndroidDeviceArtifactsAPI {
    private adb: any;
    private _recordings: Record<string, any> = {};
    private _uniqueId = 1;

    async takeScreenshot(deviceId: string) {
        const screenshotPath = this._getScreenshotPath(this._nextId());
        await this.adb.screencap(deviceId, screenshotPath);
        return new AndroidArtifact(screenshotPath, this.adb, deviceId);
    }

    async startVideo(deviceId: string) {
        const adb = this.adb;
        const videoPath = this._getVideoPath(this._nextId());
        let {width, height} = await adb.getScreenSize();
        let promise = spawnRecording();
        promise.catch(handleRecordingTermination);

        await this._waitForRecordingToStart(deviceId, videoPath);

        this._recordings[deviceId] = {
            process: promise.childProcess,
            promise,
            videoPath
        };

        function handleRecordingTermination(result: any) {
            const proc = result.childProcess;
            // XXX: error code -38 (= 218) means that encoder was not able to create
            // video of current size, let's try smaller resolution.
            if (proc.exitCode === 218) {
                width >>= 1;
                height >>= 1;
                promise = spawnRecording();
                promise.catch(handleRecordingTermination);
            }
        }

        function spawnRecording() {
            return adb.screenrecord(deviceId, videoPath, width, height);
        }
    }

    async _waitForRecordingToStart(deviceId: string, videoPath: string) {
        // XXX: ugly loop to make sure we continue only if recording has begun.
        let recording = false;
        let size = 0;
        while (!recording) {
            size = 0;
            recording = true;
            try {
                size = await this.adb.getFileSize(deviceId, videoPath);
                if (size < 1) {
                    recording = false;
                }
            } catch (e) {
                recording = false;
            }
        }
    }

    stopVideo(deviceId: string) {
        if (this._recordings[deviceId]) {
            const {process, promise, videoPath} = this._recordings[deviceId];
            delete this._recordings[deviceId];
            return new Promise((resolve) => {
                promise.catch(() => resolve(
                    new AndroidArtifact(videoPath, this.adb, deviceId)
                ));
                process.kill(2);
            });
        }
        return Promise.resolve(null);
    }

    private _nextId(): string {
        return String(this._uniqueId++);
    }

    private _getVideoPath(id: string): string {
        return `/sdcard/recording-${id}.mp4`;
    }

    private _getScreenshotPath(id: string): string {
        return `/sdcard/screenshot-${id}.png`;
    }
}
