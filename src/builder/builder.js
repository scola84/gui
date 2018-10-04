import GraphicWorker from '../worker/graphic';

export default class Builder extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._finish = null;
    this._prepare = null;
    this._render = null;

    this.setFinish(options.finish);
    this.setPrepare(options.prepare);
    this.setRender(options.render);
  }

  setFinish(value = true) {
    this._finish = value;
    return this;
  }

  setPrepare(value = true) {
    this._prepare = value;
    return this;
  }

  setRender(value = null) {
    this._render = value;
    return this;
  }
}
