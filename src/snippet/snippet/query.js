import Snippet from '../snippet';

export default class Query extends Snippet {
  constructor(options = {}) {
    super(options);

    this._node = null;
    this.setNode(options.node);
  }

  getNode() {
    if (this._node === null) {
      return this._builder.getView().node();
    }

    return this._node;
  }

  setNode(value = null) {
    this._node = value;
    return this;
  }

  find(compare) {
    let result = [];

    const snippets = this.all();

    for (let i = 0; i < snippets.length; i += 1) {
      result = result.concat(snippets[i].find(compare));
    }

    return result;
  }

  resolve(box, data) {
    const snippets = this.all();

    for (let i = 0; i < snippets.length; i += 1) {
      snippets[i].resolve(box, data);
    }
  }

  one() {
    const node = this
      .getNode()
      .select(this._list[0])
      .node();

    return node ? node.snippet : null;
  }

  all() {
    const all = [];

    this
      .getNode()
      .selectAll(this._list[0])
      .each((datum, index, nodes) => {
        all[all.length] = nodes[index].snippet;
      });

    return all;
  }

  next() {
    const node = this
      .getNode()
      .node();

    if (node.nextSibling) {
      return node.nextSibling.snippet;
    }

    return null;
  }

  previous() {
    const node = this
      .getNode()
      .node();

    if (node.previousSibling) {
      return node.previousSibling.snippet;
    }

    return null;
  }
}
