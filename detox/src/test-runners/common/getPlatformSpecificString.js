function getPlatformSpecificString(platform) {
    switch (platform) {
        case 'ios': return ':android:';
        case 'android': return ':ios:';
        default: return undefined;
    }
}

module.exports = getPlatformSpecificString;
