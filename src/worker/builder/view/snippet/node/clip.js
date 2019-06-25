import { select } from 'd3';
import { Node } from '../node';

export class Clip extends Node {
  createNode() {
    const fragment = document.createDocumentFragment();

    fragment.getAttribute = () => {};
    fragment.setAttribute = () => {};
    fragment.snippet = this;

    this.setNode(select(fragment));
  }

  resolveInner(box, data) {
    for (let i = 0; i < this._list.length; i += 1) {
      if (i === box.tab) {
        this.resolveSnippet(box, data, this._list[i]);
      } else {
        this._list[i].remove();
      }
    }

    this._parent
      .node()
      .node()
      .appendChild(this._node.node());

    return this.resolveAfter(box, data);
  }
}
