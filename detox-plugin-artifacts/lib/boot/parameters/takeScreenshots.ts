import {DetoxBehaviorPluginAPI, DetoxParameterMetadata} from "detox";
import {DetoxArtifactsPluginConfiguration} from "../DetoxArtifactsPluginConfiguration";

type TakeScreenshotsParam  = DetoxArtifactsPluginConfiguration['takeScreenshots'];

export function registerTakeScreenshotsParameter(api: DetoxBehaviorPluginAPI): void {
    api.registerParameter({
        camelCaseName: 'takeScreenshots',
        description: 'Save screenshots before and after each test to artifacts directory. Pass "failing" to save screenshots of failing tests only.',
        defaultValue: 'none',
        required: false,
        parse(value: string): TakeScreenshotsParam {
            switch (value) {
                case 'none':
                case 'failing':
                case 'all':
                    return value;
                default:
                    throw new Error('has incorrect value: ' + JSON.stringify(value));
            }

        }
    } as DetoxParameterMetadata<TakeScreenshotsParam>);
}
