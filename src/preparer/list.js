import { Worker } from '@scola/worker';
import { select } from 'd3';
import throttle from 'lodash-es/throttle';

export default class ListPreparer extends Worker {
  constructor(options = {}) {
    super(options);

    this._height = null;
    this.setHeight(options.height);
  }

  setHeight(value = 48) {
    this._height = value;
    return this;
  }

  act(route, data = {}) {
    const body = select(route.node).select('.body');
    const height = parseInt(body.style('height'), 10) || 768;

    data.offset = data.offset || 0;
    data.count = Math.round(height / this._height) * 2;

    body.classed('nav outset busy', true);

    body.on('scroll', throttle((datum, index, nodes) => {
      if (body.classed('done') === true) {
        return;
      }

      if (body.classed('busy') === true) {
        return;
      }

      const top = height + nodes[index].scrollTop;
      const threshold = nodes[index].scrollHeight - (height / 4);

      if (top > threshold) {
        data.offset += data.count;
        this.act(route, data);
      }
    }, 250));

    this.pass(route, data);
  }
}
