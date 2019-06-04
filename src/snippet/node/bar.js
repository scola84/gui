import Node from '../node';

export default class Bar extends Node {
  resolveBefore(box, data) {
    this._checkChild(0, 'left');
    this._checkChild(1, 'center');
    this._checkChild(2, 'right');

    this.resolveOuter(box, data);
  }

  _checkChild(index, classed) {
    const node = this._list[index];

    const isDefined = typeof node !== 'undefined' &&
      typeof node.getClassed()[classed] !== 'undefined';

    if (isDefined === true) {
      return;
    }

    this._list.splice(index, 0, new Node({
      classed: {
        [classed]: true
      }
    }));
  }
}