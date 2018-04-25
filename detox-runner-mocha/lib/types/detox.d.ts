declare module "detox/integration/runner" {
    type DetoxTestRunnerIntegration = DetoxTestRunnerIntegrationV0;

    type DetoxDeviceConfiguration = {
        binaryPath: string;
        type: DetoxDeviceConfigurationType;
        name: string;
        build?: string;
        session?: DetoxServerConfiguration;
    };

    type DetoxDeviceConfigurationType =
        'ios.simulator' |
        'ios.none' |
        'android.emulator' |
        'android.device' |
        'android.none';

    type DetoxServerConfiguration = {
        server: string;
        sessionId: string;
    };

    type DetoxPackageJsonSection = {
        "test-runner": "mocha" | "jest";
        "runner-config": string;

        // optional aliases
        testRunner?: "mocha" | "jest";
        runnerConfig?: string;

        specs: string;
        configurations: Record<string, DetoxDeviceConfiguration>;
        session?: DetoxServerConfiguration;
    };

    type DetoxOption = {
        name: string;
        configAliases?: string[];
        description: string;
        scopes: DetoxOptionScope[];
        shortName?: string;
        value?: {
          name: string;
          required?: boolean;
          defaultValue?: any;
        };

        transform?(value: any, acc: any): any;
        validate?(value: any, options: Readonly<Record<string, Readonly<DetoxOption>>>): void | never;
    };

    type DetoxCLIOptions = {

    };

    type DetoxOptionScope = 'cli' | 'device-configuration' | 'detox-configuration';

    type DetoxCLIOptionSource = {};
    type DetoxSectionOptionSource = {};
    type DetoxDeviceConfigurationOptionSource = {};

    type DetoxTestRunnerIntegrationV0 = {
        protocol: 0;
        cli: DetoxTestRunnerCommandLineIntegration;
    }

    type DetoxTestRunnerCommandLineIntegration = {
        init: DetoxTestRunnerInitModule;
        test: DetoxTestRunnerTestModule;
    }

    type DetoxTestRunnerInitModule = {

    };

    type DetoxTestRunnerTestModule = {
        run(options: DetoxTestRunOptions): void;
        setup(hooks: DetoxTestRunnerLifecycleHooks): void;
        isRunning(): boolean;
    };

    type DetoxTestRunOptions = {

    };

    type DetoxTestRunnerLifecycleHooks = {
        onInit(): Promise<void>;
        onBeforeTest(): Promise<void>;
        onAfterTest(): Promise<void>;
        onExit(): Promise<void>;
    };
}