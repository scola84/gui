import Node from '../node';

export default class Hint extends Node {
  resolveAfter(box, data) {
    if (typeof data.details === 'undefined') {
      return;
    }

    if (typeof this._text.text !== 'undefined') {
      return;
    }

    const previous = this
      .query()
      .previous();

    if (previous === null) {
      return;
    }

    let name = previous.resolveAttribute(box, data, 'name');
    let value = data.details[name];

    if (Array.isArray(value) === true) {
      [name, value] = this._resolveArray(box, data, previous, name);
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
  }

  _resolveArray(box, data, previous, name) {
    const multiple = previous.resolveAttribute(box, data, 'multiple');

    const all = this._builder
      .getView()
      .query(`input[name="${name}"]`)
      .all();

    let value = null;

    if (typeof multiple === 'undefined') {
      const index = all.indexOf(previous);
      value = data[name] && data[name][index];
    } else {
      value = data[name].reduce((a, v) => v, {});
    }

    return [name, value];
  }
}
