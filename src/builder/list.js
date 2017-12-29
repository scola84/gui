import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class ListBuilder extends GraphicWorker {
  act(route, data, callback) {
    const node = select(route.node);

    let list = node
      .select('.body')
      .classed('busy', false)
      .classed('done', data.length === 0)
      .selectAll('ul')
      .data([0]);

    list = list
      .enter()
      .append('ul')
      .classed('block', true)
      .merge(list);

    const item = list
      .selectAll('li');

    const update = item
      .data(data, (datum) => JSON.stringify(datum));

    const exit = update.exit();

    const enter = update
      .enter()
      .append('li');

    if (item.size() === 0 && data.length === 0) {
      this.fail(route, new Error('empty'));
      return;
    }

    enter
      .append('button')
      .attr('tabindex', 0)
      .text((d, i, n) => this.format(d, i, n));

    this.pass(route, { enter, exit, update }, callback);
  }
}
