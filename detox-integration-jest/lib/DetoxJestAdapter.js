class DetoxJestAdapter /* implements JasmineReporter */ {
  constructor(detox) {
    this.detox = detox;
    this._currentSpec = null;
    this._todo = Promise.resolve();
    this.timeout = 30000;
  }

  async beforeEach() {
    await this._flush();
    await this.detox.beforeEach(this._currentSpec);
  }

  async afterAll() {
    await this._flush();
  }

  async _afterEach(previousSpec) {
    await this.detox.afterEach(previousSpec);
  }

  async _flush() {
    await this._todo;
  }

  specStarted(result) {
    const spec = Object.freeze({
      title: result.description,
      fullName: result.fullName,
      status: 'running',
    });

    this._currentSpec = spec;
  }

  specDone(result) {
    const spec = Object.freeze({
      title: result.description,
      fullName: result.fullName,
      status: result.status,
    });

    this._enqueue(() => this._afterEach(spec));
  }

  _enqueue(fn) {
    this._todo = this._todo.then(fn);
  }
}

module.exports = DetoxJestAdapter;
