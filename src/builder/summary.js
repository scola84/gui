import { select } from 'd3';
import Builder from './builder';
import renderSummary from '../helper/render/summary';

export default class SummaryBuilder extends Builder {
  setRender(value = renderSummary) {
    return super.setRender(value);
  }

  act(route, data, callback) {
    if (this._prepare) {
      this._prepareSummary(route, data);
    }

    if (this._finish) {
      route.summary = this._finishSummary(route, data);
    }

    this.pass(route, data, callback);
  }

  _finishSummary(route, data = {}) {
    data = this.filter(route, data);
    const panel = select(route.node);

    const number = panel
      .selectAll('div.summary')
      .size() - 1;

    const summary = panel
      .select('#' + this._createTarget('summary', number));

    const primary = summary
      .append('div')
      .classed('primary', true);

    const enter = primary
      .append('figure')
      .selectAll('div')
      .data(this._structure.figure || [])
      .enter()
      .append('div');

    this._render(enter, (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
    });

    const secondary = summary
      .append('div')
      .classed('secondary', true);

    const title = secondary
      .append('div')
      .classed('title', true);

    title
      .append('span')
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'l1', route });
      });

    title
      .append('span')
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'l2', route });
      });

    title
      .append('span')
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'l3', route });
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
        return this.format(d, i, n, { data, name: 'action', route });
      });

    return summary;
  }

  _prepareSummary(route) {
    const panel = select(route.node);

    const number = panel
      .selectAll('div.summary')
      .size();

    panel
      .select('.body .content')
      .append('div')
      .attr('id', this._createTarget('summary', number))
      .classed('summary', true);
  }
}
