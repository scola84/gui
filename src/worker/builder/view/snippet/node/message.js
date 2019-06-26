import { Node } from '../node';

export class Message extends Node {
  resolveAfter(box, data) {
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

    this._node
      .classed('transition', true)
      .classed('in', true)
      .on('transitionend.scola-message', () => {
        this._node
          .classed('transition', false)
          .on('transitionend.scola-message', null);
      });

    return this._node;
  }
}
