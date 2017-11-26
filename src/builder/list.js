import { Worker } from '@scola/worker';
import { select } from 'd3';

export default class ListBuilder extends Worker {
  constructor(methods) {
    super(methods);
    this._format = (datum) => datum;
  }

  setFormat(value) {
    this._format = value;
    return this;
  }

  act(route, data, callback) {
    const node = select(route.node);

    node
      .select('.message')
      .remove();

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

    const update = list
      .selectAll('li')
      .data(data, (datum) => JSON.stringify(datum));

    if (update.size() === 0 && data.length === 0) {
      this.fail(route, new Error('empty'));
      return;
    }

    const exit = update.exit();

    const enter = update
      .enter()
      .append('li');

    enter
      .append('a')
      .attr('tabindex', 0)
      .text(this._format);

    this.pass(route, { enter, exit, update }, callback);
  }
}
