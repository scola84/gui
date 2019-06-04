import Node from '../node';

export default class Form extends Node {
  constructor(options = {}) {
    super(options);

    this
      .setAttributes({
        novalidate: 'novalidate'
      })
      .setName('form');
  }

  isLocked() {
    return this._node.classed('locked');
  }

  lock() {
    this._node.classed('locked', true);
    return this;
  }

  unlock() {
    this._node.classed('locked', false);
    return this;
  }
}
