import { Node } from '../node';

export class Hint extends Node {
  resolveAfter(box, data) {
    if (typeof data.data === 'undefined' || data.data === null) {
      return this._node;
    }

    const parent = this._node.node().parentNode;
    let input = parent.querySelector('input, select, textarea');

    if (input === null || typeof input.snippet === 'undefined') {
      return this._node;
    }

    input = input.snippet;

    let name = input.node().attr('name');
    let value = data.data[name];

    if (Array.isArray(value) === true) {
      [name, value] = this.resolveArray(box, data, input, name, value);
    }

    let text = null;

    if (
      typeof value !== 'undefined' &&
      typeof value.reason !== 'undefined'
    ) {
      text = this._builder
        .format()
        .code(`input.${value.type}.${value.reason}`)
        .values(value);
    }

    this._node.text(
      this.resolveValue(box, data, text)
    );

    return this._node;
  }

  resolveArray(box, data, input, name, value) {
    const multiple = input
      .node()
      .attr('multiple');

    const all = this._builder
      .getView()
      .query(`input[name="${name}"]`)
      .resolve();

    if (typeof multiple === 'undefined') {
      const index = all.indexOf(input);
      value = value[index];
    } else {
      value = value.reduce((a, v) => v, {});
    }

    return [name, value];
  }
}
