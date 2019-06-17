import Node from '../node';

export default class Hint extends Node {
  resolveAfter(box, data) {
    if (typeof data.data === 'undefined') {
      return this._node;
    }

    if (typeof this._text.text !== 'undefined') {
      return this._node;
    }

    const previous = this
      .query()
      .previous();

    if (previous === null) {
      return this._node;
    }

    let name = previous.node().attr('name');
    let value = data.data[name];

    if (Array.isArray(value) === true) {
      [name, value] = this.resolveArray(box, data, previous, name, value);
    }

    let text = null;

    if (
      typeof value !== 'undefined' &&
      typeof value.reason !== 'undefined'
    ) {
      text = this._builder.format([
        `input.${value.type}.${value.reason}`,
        value
      ]);
    }

    this._node.text(
      this.resolveValue(box, data, text)
    );

    return this._node;
  }

  resolveArray(box, data, previous, name, value) {
    const multiple = previous.node().attr('multiple');

    const all = this._builder
      .getView()
      .query(`input[name="${name}"]`)
      .all();

    if (typeof multiple === 'undefined') {
      const index = all.indexOf(previous);
      value = value[index];
    } else {
      value = value.reduce((a, v) => v, {});
    }

    return [name, value];
  }
}
