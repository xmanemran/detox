export class DeviceArtifactsAPI {
    constructor() {}

    startVideo(videoName: string): Promise<void> {
        console.log('started recording video: ', videoName);
        return Promise.resolve();
    }

    stopVideo(shouldSave?: boolean): Promise<void> {
        console.log('stopped recording video');
        console.log(shouldSave ? 'saving video' : 'deleting video');

        return Promise.resolve();
    }

    takeScreenshot(screenshotName: string): Promise<void> {
        console.log('taking screenshot: ', screenshotName);
        return Promise.resolve();
    }
}