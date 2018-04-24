declare module "detox/integration/runner" {
    type DetoxTestRunnerIntegration = DetoxTestRunnerIntegrationV0;

    type DetoxOption = {
        name: string;
        description: string;
        alias?: string;
        value?: string;
        required?: boolean;
        defaultValue?: any;
        transform?(value: any, acc: any): any;
    };

    interface DetoxOptionSource {

    }

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