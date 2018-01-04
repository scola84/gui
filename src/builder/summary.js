import { select } from 'd3';
import GraphicWorker from '../worker/graphic';
import figure from './summary/figure';

export default class SummaryBuilder extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._finish = null;
    this._id = null;
    this._prepare = null;
    this._structure = null;

    this.setFinish(options.finish);
    this.setId(options.id);
    this.setPrepare(options.prepare);
    this.setStructure(options.structure);
  }

  setFinish(value = true) {
    this._finish = value;
    return this;
  }

  setId(value = null) {
    this._id = value;
    return this;
  }

  setPrepare(value = true) {
    this._prepare = value;
    return this;
  }

  setStructure(value = null) {
    this._structure = value;
    return this;
  }

  act(route, data, callback) {
    if (this._prepare) {
      this._prepareSummary(route, data);
    }

    if (this._finish) {
      data = this._finishSummary(route, data);
    }

    this.pass(route, data, callback);
  }

  _prepareSummary(route) {
    const id = this._id || select(route.node)
      .selectAll('.body>div.summary')
      .size();

    select(route.node)
      .select('.body')
      .append('div')
      .attr('id', 'summary-' + id)
      .classed('summary', true);
  }

  _finishSummary(route, data = {}) {
    const id = this._id || select(route.node)
      .selectAll('.body>div.summary')
      .size() - 1;

    const summary = select(route.node)
      .select('div#summary-' + id);

    const primary = summary
      .append('div')
      .classed('primary', true);

    const figures = primary
      .append('figure')
      .selectAll('div')
      .data(this._structure.figure || [])
      .enter()
      .append('div');

    figures.each((datum, index, nodes) => {
      const node = select(nodes[index]);

      if (datum.type && figure[datum.type]) {
        const child = figure[datum.type]
          .create(node, data, (context) => {
            return this.format(datum, index, nodes, context);
          });

        if (child === null) {
          node.remove();
        }
      }
    });

    const secondary = summary
      .append('div')
      .classed('secondary', true);

    const title = secondary
      .append('div')
      .classed('title', true);

    title
      .append('span')
      .classed('label', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'summary.label' });
      });

    title
      .append('span')
      .classed('sub', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'summary.sub' });
      });

    title
      .append('span')
      .classed('value', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'summary.value' });
      });

    const actions = secondary
      .append('ul')
      .classed('actions', true)
      .selectAll('li')
      .data(this._structure.actions)
      .enter()
      .append('li')
      .attr('class', (datum) => datum.name);

    actions
      .append('button')
      .attr('tabindex', 0)
      .attr('class', (datum) => 'button ' + datum.button);

    actions
      .append('span')
      .classed('label', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { name: 'summary.action' });
      });

    return { summary };
  }
}
