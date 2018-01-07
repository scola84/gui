import { Worker } from '@scola/worker';

export default class GraphicWorker extends Worker {
  constructor(options = {}) {
    super(options);

    this._format = options.format;
    this._target = null;

    this.setTarget(options.target);
  }

  setTarget(value = null) {
    this._target = value;
    return this;
  }

  format(datum, index, node, context) {
    if (this._format) {
      return this._format(datum, index, node, context);
    }

    return datum.name;
  }

  _createTarget(base, number) {
    return this._target ?
      this._target : [base, this._id, number].join('-');
  }
}
