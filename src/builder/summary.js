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

  _createDatum(value, field) {
    return { field, value };
  }

  _finishSummary(route, data = {}) {
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
      .append('div')
      .datum((field) => this._createDatum(data, field));

    this._render(enter, (d, i, n, c) => {
      return this.format(d, i, n, c);
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
        return this.format({ value: data }, i, n, { name: 'summary.label' });
      });

    title
      .append('span')
      .classed('sub', true)
      .text((d, i, n) => {
        return this.format({ value: data }, i, n, { name: 'summary.sub' });
      });

    title
      .append('span')
      .classed('value', true)
      .text((d, i, n) => {
        return this.format({ value: data }, i, n, { name: 'summary.value' });
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
        return this.format({ field: d }, i, n, { name: 'summary.action' });
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
