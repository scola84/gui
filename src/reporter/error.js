import { Worker } from '@scola/worker';
import { select } from 'd3';

export default class ErrorReporter extends Worker {
  constructor(methods) {
    super(methods);

    this._format = (error) => error.message;
    this._class = 'overlay';
  }

  setClass(value) {
    this._class = value;
    return this;
  }

  setFormat(value) {
    this._format = value;
    return this;
  }

  err(route, error, callback) {
    select(route.node)
      .select('.message')
      .remove();

    select(route.node)
      .select('.body')
      .insert('div', ':first-child')
      .classed('message', true)
      .classed(this._class, true)
      .text(this._format(error));

    if (this._class === 'overlay') {
      this.fail(route, error, callback);
    }
  }
}
