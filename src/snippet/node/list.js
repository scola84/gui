import { Node } from '../node';

export class List extends Node {
  constructor(options) {
    super(options);
    this._items = [];
  }

  removeInner() {
    for (let i = 0; i < this._items.length; i += 1) {
      this._items[i].remove();
    }

    this._items = [];
    this.removeAfter();
  }

  resolveInner(box, data) {
    let newData = data.data;
    let isEmpty = false;

    if (typeof newData === 'undefined' || newData === null) {
      newData = [];
    } else if (newData.length === 0) {
      newData = [{}];
      isEmpty = true;
    }

    const [
      item,
      empty
    ] = this._list;

    let items = this._node
      .selectAll('.item');

    if (box.busy === true) {
      delete box.busy;
    }

    if (box.list) {
      if (box.list.clear) {
        delete box.list.clear;

        box.list.offset = 0;
        box.list.total = 0;

        items.remove();
        items = this._node.selectAll('.item');
      }

      if (box.list.offset === 0 && box.list.count > 0) {
        this._node.node().parentNode.scrollTop = 0;
      }

      box.list.total += newData.length;
    }

    items
      .data(newData, (datum) => JSON.stringify(datum))
      .enter()
      .append((datum) => {
        return this.append(box, datum, isEmpty ? empty : item);
      });

    return this.resolveAfter(box, data);
  }

  append(box, datum, snippet) {
    const clone = snippet.clone();
    const node = clone.resolve(box, datum);

    this._items[this._items.length] = clone;

    return Array.isArray(node) ? node[0].node() : node.node();
  }
}
