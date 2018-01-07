import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class ErrorReporter extends GraphicWorker {
  err(route, error) {
    const panel = select(route.node)
      .classed('message', true);

    panel
      .selectAll('form')
      .attr('action', null);

    panel
      .select('.body .message span')
      .text((d, i, n) => {
        return this.format(d, i, n, { route, error }) || error.message;
      });
  }
}
