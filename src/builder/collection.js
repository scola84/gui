import { Worker } from '@scola/worker';
import { select } from 'd3';

export default class CollectionBuilder extends Worker {
  constructor(methods) {
    super(methods);
    this._format = (d) => d;
  }

  setFormat(value) {
    this._format = value;
    return this;
  }

  act(route, data, callback) {
    let list = select(route.node)
      .select('.body')
      .classed('busy', false)
      .classed('done', data.length === 0)
      .selectAll('ul')
      .data([0]);

    list = list
      .enter()
      .append('ul')
      .classed('list', true)
      .merge(list);

    const update = list
      .selectAll('li')
      .data(data, (datum) => JSON.stringify(datum));

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

  err() {}
}
