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
      [name, value] = this._resolveArray(previous, data, name);
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

  _resolveArray(previous, data, name) {
    const all = this._builder
      .getView()
      .query(`input[name="${name}"]`)
      .all();

    name = name.slice(0, -2);

    const index = all.indexOf(previous);
    const value = data[name] && data[name][index];

    return [name, value];
  }
}
