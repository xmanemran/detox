import {DetoxArtifactsPluginConfiguration} from "../DetoxArtifactsPluginConfiguration";
import {DetoxBehaviorPluginAPI, DetoxParameterMetadata} from "detox";

type RecordVideosParam  = DetoxArtifactsPluginConfiguration['recordVideos'];

export function registerRecordVideosParameter(api: DetoxBehaviorPluginAPI): void {
    api.registerParameter({
        camelCaseName: 'recordVideos',
        description: 'Save screen recordings of each test to artifacts directory. Pass "failing" to save recordings of failing tests only.',
        defaultValue: 'none',
        required: false,
        parse(value: string): RecordVideosParam {
            switch (value) {
                case 'none':
                case 'failing':
                case 'all':
                    return value;
                default:
                    throw new Error('has incorrect value: ' + JSON.stringify(value));
            }

        }
    } as DetoxParameterMetadata<RecordVideosParam>);
}
