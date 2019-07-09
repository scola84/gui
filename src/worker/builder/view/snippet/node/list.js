import { Generator } from '../generator';

export class List extends Generator {
  prepareList(box, data) {
    if (box.list.clear) {
      delete box.list.clear;

      box.list.offset = 0;
      box.list.total = 0;

      this.removeChildren();
    }

    if (box.list.offset === 0 && box.list.count > 0) {
      this._node.node().parentNode.scrollTop = 0;
    }

    box.list.total += data.length;
  }

  removeInner() {
    this.removeChildren();
    this.removeAfter();
  }

  resolveInner(box, data) {
    const hasData = Array.isArray(data.data);
    const listData = data.data || [];

    const [
      item,
      empty
    ] = this._args;

    if (box.busy === true) {
      delete box.busy;
    }

    if (box.list) {
      this.prepareList(box, listData);
    }

    for (let i = 0; i < listData.length; i += 1) {
      this.appendChild(box, listData[i], item);
    }

    const size = this._node
      .select('.item:not(.out)')
      .size();

    if (hasData === true && size === 0) {
      this.appendChild(box, [{}], empty);
    }

    return this.resolveAfter(box, data);
  }
}
