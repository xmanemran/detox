import {DetoxConfiguration} from "detox";

export type DetoxArtifactsPluginConfiguration = DetoxConfiguration & {
    takeScreenshots: 'none' | 'failing' | 'all';
    recordVideos: 'none' | 'failing' | 'all';
    artifactsLocation: string;
};
