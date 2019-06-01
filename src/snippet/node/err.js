import Node from '../node';

export default class Err extends Node {
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

  after(box, data) {
    const previous = this
      .query()
      .previous();

    if (previous === null) {
      return;
    }

    const name = previous.getAttributes().name;
    const datum = data[name];

    let text = null;

    if (datum instanceof Error) {
      text = this._message !== null ?
        this._message :
        this._builder.format([
          datum.details.type,
          datum.details
        ]);
    }

    this._node.text(
      this._resolve(box, data, text)
    );
  }
}
