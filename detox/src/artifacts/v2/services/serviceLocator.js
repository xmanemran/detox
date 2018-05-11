const defaultResolvers = {
  VideoRecorder(api) {
    const platformName = api.getPlatform();

    switch (platformName) {
      case 'android': return AndroidVideoRecorder;

      default:
        throw new DetoxRuntimeError({
          message: `Failed to record video due to unknown platform: ${platformName}`,
          hint: `Only 'ios' and 'android' values are supported`,
        });
    }
  }

};

module.exports = (api, customResolvers = {}) => (name) => {
  const resolvers = Object.assign({}, defaultResolvers, customResolvers);
  const serviceResolver = resolvers[name];
  const Service = serviceResolver(api, args);

  return new Service(...args);
};
