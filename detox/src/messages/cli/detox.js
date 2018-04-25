module.exports = {
    commandDescriptions: {
        'test': 'Initiating your test suite',
        'build': `[convenience method] Run the command defined in 'configuration.build'`,
        'run-server': 'Starts a standalone detox server',
        'init': 'Create initial e2e tests folder',
        'clean-framework-cache': `Delete all compiled framework binaries from ~/Library/Detox, they will be rebuilt on 'npm install' or when running 'build-framework-cache'`,
        'build-framework-cache': `Build Detox.framework to ~/Library/Detox. The framework cache is specific for each combination of Xcode and Detox versions`,
    },
};