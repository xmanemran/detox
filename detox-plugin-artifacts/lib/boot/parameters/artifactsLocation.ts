import {DetoxBehaviorPluginAPI, DetoxParameterMetadata} from "detox";
import {DetoxArtifactsPluginConfiguration} from "../DetoxArtifactsPluginConfiguration";

type ArtifactsLocationParam = DetoxArtifactsPluginConfiguration['artifactsLocation'];

export function registerArtifactsLocationParameter(api: DetoxBehaviorPluginAPI): void {
    api.registerParameter({
        camelCaseName: 'artifactsLocation',
        shorthand: 'a',
        description: 'Artifacts destination path. If the destination already exists, it will be removed first',
        defaultValue: '',
        required: false,
    } as DetoxParameterMetadata<ArtifactsLocationParam>);
}
