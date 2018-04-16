const ArtifactBase = require('./ArtifactBase');
const sh = require('../../../detox/src/utils/sh');

class FileArtifact extends ArtifactBase {
  async copy(destination) {
    await sh.cp(`"${this._source}" "${destination}"`);
  }

  async move(destination) {
    await sh.mv(`"${this._source}" "${destination}"`);
  }

  async remove() {
    await sh.rm(`"${this._source}"`);
  }
}

module.exports = FileArtifact;
