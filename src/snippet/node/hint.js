import Node from '../node';

export default class Hint extends Node {
  constructor(options = {}) {
    super(options);

    this._message = null;
    this.setMessage(options.message);
  }

  getMessage() {
    return this._message;
  }

  setMessage(value = null) {
    this._message = value;
    return this;
  }

  message(value) {
    this._message = value;
    return this;
  }

  resolveAfter(box, data) {
    const previous = this
      .query()
      .previous();

    if (previous === null) {
      return;
    }

    let name = previous.resolveAttribute(box, data, 'name');
    let value = data[name];

    if (name.slice(-2) === '[]') {
      [name, value] = this._resolveArray(box, data, previous, name);
    }

    let text = null;

    if (typeof value !== 'undefined') {
      text = this._message;

      if (text === null) {
        text = this._builder.format([
          `dom.input.${value.type}.${value.reason}`,
          value
        ]);
      }
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

    name = name.slice(0, -2);
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
