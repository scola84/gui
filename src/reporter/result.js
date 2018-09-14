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
    data = this.filter(route, data);

    const panel = select(route.node)
      .classed('show-message', true)
      .classed(this._class, true);

    panel
      .selectAll('form')
      .attr('action', null);

    panel
      .select('.body .message span')
      .text((d, i, n) => {
        return this.format(d, i, n, { data, route });
      });

    this.pass(route, data, callback);
  }
}
