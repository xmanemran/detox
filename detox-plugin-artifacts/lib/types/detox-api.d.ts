declare module "detox" {
    type DetoxParameterMetadata<T> = {
        readonly camelCaseName: string;
        readonly description?: string;
        readonly shorthand?: string;
        readonly defaultValue?: T;
        readonly required?: boolean;

        parse?(value: string, accumulator: T): T;
    };

    type DetoxTestContext = {
        readonly incrementalId: number;
        readonly title: string;
        readonly fullTitle: string;
        readonly failed: boolean;
    };

    type DetoxDeviceContext = {
        plugins: Record<string, any>;
    };

    type DetoxConfiguration = {

    };

    interface DetoxBehaviorPluginAPI {
        registerParameter(parameterMetadata: DetoxParameterMetadata<any>): void;
        getCurrentTestContext(): Readonly<DetoxTestContext> | null;
        getDevice(): Readonly<DetoxDeviceContext>;
        getConfiguration(): Readonly<DetoxConfiguration>;
    }

    interface DetoxBehaviorPlugin {
        readonly name: string;

        onStart?(): Promise<void>;
        onBeforeTest?(): Promise<void>;
        onAfterTest?(): Promise<void>;
        onExit?(): Promise<void>;
    }

    type DetoxBehaviorPluginFactory = (api: DetoxBehaviorPluginAPI) => DetoxBehaviorPlugin;
}