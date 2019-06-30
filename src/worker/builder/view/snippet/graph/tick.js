import { Node } from '../node';

export class Tick extends Node {
  constructor(options = {}) {
    super(options);

    this._count = null;
    this._step = null;

    this.setCount(options.count);
    this.setStep(options.step);
  }

  getCount() {
    return this._count;
  }

  setCount(value = null) {
    this._count = value;
    return this;
  }

  count(value) {
    return this.setCount(value);
  }

  getStep() {
    return this._step;
  }

  setStep(value = null) {
    this._step = value;
    return this;
  }

  step(value) {
    return this.setStep(value);
  }

  resolveAfter() {
    const text = this._node.text();

    this._node.text(null);

    this._node
      .append('div')
      .classed('text', true)
      .text(text);

    this._node
      .append('div')
      .classed('mark', true);
  }
}
