const buildCliArgumentsString = require('./buildCliArgumentsString');

describe(buildCliArgumentsString.name, function() {
    it('should return empty string when given no args', () => {
        expect(buildCliArgumentsString()).toBe('');
    });

    it('should return empty string when given empty args', () => {
        expect(buildCliArgumentsString({})).toBe('');
    });

    it('should turn all keys into --kebab-case', () => {
        expect(buildCliArgumentsString({
            'snake_case': 1,
            'kebab-case': 2,
            'PascalCase': 3,
            'camelCase': 4,
        })).toBe('--snake-case 1 --kebab-case 2 --pascal-case 3 --camel-case 4');
    });

    it('should turn { "flag": true } entries simply to --flag', () => {
        expect(buildCliArgumentsString({
            'string': "1",
            'boolean': true,
            'skip': false,
        })).toBe('--string 1 --boolean');
    });

    it('should skip nullable values except 0', () => {
        expect(buildCliArgumentsString({
            'zero': 0,
            'skip1': false,
            'skip2': null,
            'skip3': undefined,
        })).toBe('--zero 0');
    });
});
