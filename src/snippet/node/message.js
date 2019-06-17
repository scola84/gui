import Node from '../node';

export default class Message extends Node {
  resolveAfter(box, data) {
    if (this._node.text() !== '') {
      return this._node;
    }

    if (typeof data.status === 'undefined') {
      return this._node;
    }

    let code = `status.${data.status}`;

    if (data.code) {
      code += '.' + data.code;
    }

    const text = this._builder.format([
      code,
      data
    ]);

    this._node.text(
      this.resolveValue(box, data, text)
    );

    this._node.classed('show', true);

    return this._node;
  }
}
