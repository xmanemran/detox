const DetoxRuntimeError = require('../../../../errors/DetoxRuntimeError');

class GuardedVideoRecording {
  constructor(recording) {
    this._recording = recording;
    this._onStart = null;
    this._onStop = null;
    this._onSave = null;
    this._onDiscard = null;
  }

  start() {
    this._assertRecordingIsNotBeingResumed();

    if (!this._onStart) {
      this._onStart = this._recording.start().then(() => this);
    }

    return this._onStart;
  }

  stop() {
    this._assertRecordingHasBeenStarted();

    if (!this._onStop) {
      this._onStop = this._recording.stop().then(() => this);
    }

    return this._onStop;
  }

  save() {
    this._assertRecordingIsNotBeingDiscarded();
    this.stop();

    if (!this._onSave) {
      this._onSave = this._onStop
        .then(() => this._recording.save())
        .then(() => this);
    }

    return this._onSave;
  }

  discard() {
    this._assertRecordingIsNotBeingSaved();
    this.stop();

    if (!this._onDiscard) {
      this._onDiscard = this._onDiscard
        .then(() => this._recording.discard())
        .then(() => this);
    }

    return this._onDiscard;
  }

  _assertRecordingIsNotBeingResumed() {
    if (this._onStop) {
      throw new DetoxRuntimeError({
        message: 'Resuming video recording after .stop() is not supported by Detox',
        hint: 'Consider creating new video recording',
      });
    }
  }

  _assertRecordingHasBeenStarted() {
    if (!this._onStart) {
      throw new DetoxRuntimeError({
        message: 'Cannot stop video recording if it has never been started',
        hint: 'This error is not supposed to happen, open an issue on Github if you see it.',
      });
    }
  }

  _assertRecordingIsNotBeingDiscarded() {
    if (this._onDiscard) {
      throw new DetoxRuntimeError({
        message: 'Cannot save video recording because it is already being discarded',
        hint: 'Make sure you did not call .discard() method earlier',
      });
    }
  }

  _assertRecordingIsNotBeingSaved() {
    if (this._onSave) {
      throw new DetoxRuntimeError({
        message: 'Cannot discard video recording because it is already being saved',
        hint: 'Make sure you did not call .save() method earlier',
      });
    }
  }
}

module.exports = GuardedVideoRecording;