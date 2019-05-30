import Node from '../node';

export default class Err extends Node {
  constructor(options = {}) {
    super(options);

    this._message = null;
    this.setMessage(options.message);

    this.setClassed({
      error: true
    });
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

  _resolveAfter(box, data) {
    const previous = this.queryPrevious();

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

    text = this._resolve(box, data, text);

    this._node.text(text);
  }
}
