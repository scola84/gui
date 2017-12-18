import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class ResultReporter extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._class = null;
    this.setClass(options.class);
  }

  setClass(value = 'inline') {
    this._class = value;
    return this;
  }

  act(route, data, callback) {
    select(route.node)
      .selectAll('form')
      .attr('action', null);

    select(route.node)
      .select('.message')
      .remove();

    select(route.node)
      .select('.body')
      .insert('div', ':first-child')
      .classed('message', true)
      .classed(this._class, true)
      .text(this.format(data));

    this.pass(route, data, callback);
  }
}
