const _ = require('lodash');

function isFlag(value) {
    return (value === true) || (value === '');
}

function shouldSkip(value) {
    return (value === false) || (value === null) || (value === undefined);
}

function buildCliArgumentsString(keyValues) {
    let str = '';

    for (const key in keyValues) {
        if (!keyValues.hasOwnProperty(key)) {
            continue;
        }

        const value = keyValues[key];

        if (shouldSkip(value)) {
            continue;
        }

        str += '--' + _.kebabCase(key);

        if (isFlag(value)) {
            continue;
        }

        str += ' ' + value;
    }

    return str;
}

module.exports = buildCliArgumentsString;