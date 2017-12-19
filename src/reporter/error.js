import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class ErrorReporter extends GraphicWorker {
  err(route, error) {
    select(route.node)
      .select('.message')
      .remove();

    select(route.node)
      .select('.body')
      .insert('div', ':first-child')
      .classed('message', true)
      .append('span')
      .text(this.format(error));
  }
}
