import { Worker } from '@scola/worker';

export default class GraphicWorker extends Worker {
  constructor(methods = {}) {
    super(methods);
    this._format = methods.format;
  }

  format(datum, index, node, context) {
    if (this._format) {
      return this._format(datum, index, node, context);
    }

    return datum.name;
  }
}
