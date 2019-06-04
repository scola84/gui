import Snippet from '../snippet';

export default class Query extends Snippet {
  constructor(options = {}) {
    super(options);

    this._node = null;
    this.setNode(options.node);
  }

  getNode() {
    return this._node;
  }

  setNode(value = null) {
    this._node = value;
    return this;
  }

  find(compare) {
    let result = [];
    const snippet = this.resolve();

    if (snippet !== null) {
      result = snippet.find(compare);
    }

    return result;
  }

  resolve() {
    this._node = this._builder
      .getView()
      .node();

    return this.one();
  }

  one() {
    if (this._node === null) {
      return null;
    }

    const node = this._node
      .select(this._list[0])
      .node();

    return node ? node.snippet : null;
  }

  all() {
    const all = [];

    if (this._node === null) {
      return all;
    }

    this._node
      .selectAll(this._list[0])
      .each((datum, index, nodes) => {
        all[all.length] = nodes[index].snippet;
      });

    return all;
  }

  next() {
    if (this._node === null) {
      return null;
    }

    const node = this._node.node();

    if (node.nextSibling) {
      return node.nextSibling.snippet;
    }

    return null;
  }

  previous() {
    if (this._node === null) {
      return null;
    }

    const node = this._node.node();

    if (node.previousSibling) {
      return node.previousSibling.snippet;
    }

    return null;
  }
}
