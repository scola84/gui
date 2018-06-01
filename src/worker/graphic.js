import { Worker } from '@scola/worker';

export default class GraphicWorker extends Worker {
  constructor(options = {}) {
    super(options);

    this._format = options.format;

    this._route = null;
    this._structure = null;
    this._target = null;

    this.setRoute(options.route);
    this.setStructure(options.structure);
    this.setTarget(options.target);
  }

  setRoute(value = null) {
    this._route = value;
    return this;
  }

  setStructure(value = null) {
    this._structure = value;
    return this;
  }

  setTarget(value = null) {
    this._target = value;
    return this;
  }

  format(datum, index, nodes, ...args) {
    if (this._format) {
      return this._format(datum, index, nodes, ...args);
    }

    return datum && datum.name;
  }

  route(datum, index, nodes, ...args) {
    if (this._route) {
      return this._route(datum, index, nodes, ...args);
    }

    return {};
  }

  _createTarget(base, number) {
    return this._target ?
      this._target : [base, this._id, number].join('-');
  }
}
