const registerCliParam = require('./registerParam');
const params = require('./params/index');

describe(registerCliParam.name, () => {
  let program;

  beforeEach(() => {
    program = { option: jest.fn() };
  });

  describe('behavior', () => {
    it('should accept shorthand parameter', () => {
      registerCliParam(program, { alias: 'c' });
      expect(program.option).toHaveBeenCalledWith('-c', '');
    });

    it('should accept shorthand parameter with hint', () => {
      registerCliParam(program, { alias: 'c', hint: 'configuration' });
      expect(program.option).toHaveBeenCalledWith('-c [configuration]', '');
    });

    it('should accept full name parameter', () => {
      registerCliParam(program, { name: 'param-name' });
      expect(program.option).toHaveBeenCalledWith('--param-name', '');
    });

    it('should accept mandatory parameter with hint', () => {
      registerCliParam(program, { name: 'param-name', required: true, hint: 'value' });
      expect(program.option).toHaveBeenCalledWith('--param-name <value>', '');
    });

    it('should accept parameter description', () => {
      registerCliParam(program, { name: 'flag', description: 'flag description' });
      expect(program.option).toHaveBeenCalledWith('--flag', 'flag description');
    });

    it('should accept parameter default value', () => {
      registerCliParam(program, { name: 'param', hint: 'value', defaultValue: 'some' });
      expect(program.option).toHaveBeenCalledWith('--param [value]', '', 'some');
    });

    it('should accept parameter transform function', () => {
      const transform = () => {};
      registerCliParam(program, { name: 'param', hint: 'value', transform });
      expect(program.option).toHaveBeenCalledWith('--param [value]', '', transform);;
    });

    it('should accept parameter transform function together with default value', () => {
      const transform = () => {};
      registerCliParam(program, { name: 'param', hint: 'value', defaultValue: 'some', transform });
      expect(program.option).toHaveBeenCalledWith('--param [value]', '', 'some', transform);;
    });
  });

  it('should integrate with existing params', () => {
    Object.values(params).forEach(p => registerCliParam(program, p));

    expect(program.option).toHaveBeenCalledWith('-c, --configuration [device configuration]', params.configuration.description);
    expect(program.option).toHaveBeenCalledWith('-d, --debug-synchronization [value]', params.debugSynchronization.description, jasmine.any(Function));
    expect(program.option).toHaveBeenCalledWith('-l, --loglevel [value]', params.loglevel.description);
    expect(program.option).toHaveBeenCalledWith('-p, --platform [ios/android]', params.platform.description);
    expect(program.option).toHaveBeenCalledWith('-r, --reuse', params.reuse.description);
    expect(program.option).toHaveBeenCalledWith('-u, --cleanup', params.cleanup.description);
  });
});
