import {instantiateDetoxArtifactsPlugin} from "./boot/instantiatePlugin";
import {DetoxBehaviorPluginFactory} from "detox";

export default (instantiateDetoxArtifactsPlugin as DetoxBehaviorPluginFactory);
