import { Worker } from '@scola/worker';
import { select } from 'd3';

export default class ResultReporter extends Worker {
  constructor(methods) {
    super(methods);

    this._format = () => '';
    this._class = 'inline';
  }

  setClass(value) {
    this._class = value;
    return this;
  }

  setFormat(value) {
    this._format = value;
    return this;
  }

  act(route, data, callback) {
    select(route.node)
      .select('.message')
      .remove();

    select(route.node)
      .select('.body')
      .insert('div', ':first-child')
      .classed('message', true)
      .classed(this._class, true)
      .text(this._format(data));

    this.pass(route, data, callback);
  }
}
