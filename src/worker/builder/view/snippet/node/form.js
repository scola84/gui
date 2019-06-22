import { Node } from '../node';

export class Form extends Node {
  constructor(options) {
    super(options);

    this
      .attributes({
        novalidate: 'novalidate'
      })
      .name('form');
  }

  resolveBefore(box, data) {
    if (box.busy === true) {
      delete box.busy;
      return this._node;
    }

    return this.resolveOuter(box, data);
  }
}
