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

  _renderAfter(box, data) {
    const previous = this.queryPrevious();

    if (previous === null) {
      return;
    }

    const name = previous.getAttributes().name;
    const datum = data[name];

    let text = null;

    if (datum instanceof Error) {
      if (this._message === null) {
        text = this._builder.format([
          datum.details.type,
          datum.details
        ]).render(box, data);
      } else {
        text = this._resolve(this._message, box, data);
      }
    }

    this._node.text(text);
  }
}
