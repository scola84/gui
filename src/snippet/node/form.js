import { Node } from '../node';

export class Form extends Node {
  constructor(options) {
    super(options);

    this
      .name('form')
      .attributes({
        novalidate: 'novalidate'
      });
  }

  resolveBefore(box, data) {
    if (box.busy === true) {
      delete box.busy;
      return this._node;
    }

    return this.resolveOuter(box, data);
  }
}
