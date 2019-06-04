import Node from '../node';

export default class Bar extends Node {
  resolveBefore(box, data) {
    this.checkChild(0, 'left');
    this.checkChild(1, 'center');
    this.checkChild(2, 'right');

    this.resolveOuter(box, data);
  }

  checkChild(index, classed) {
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
