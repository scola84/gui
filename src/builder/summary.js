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

  filter(box, data, context) {
    if (this._filter) {
      return this._filter(box, data, context);
    }

    return data.data || {};
  }

  _finishSummary(route, data = {}) {
    data = this.filter(route, data);
    const panel = select(route.node);

    const number = panel
      .selectAll('div.summary')
      .size() - 1;

    const summary = panel
      .select('#' + this._createTarget('summary', number))
      .datum(this._structure);

    const details = summary
      .append('div')
      .classed('details', true);

    const primary = details
      .append('div')
      .classed('primary', true);

    const figure = primary
      .append('figure');

    const enter = figure
      .selectAll('div')
      .data((datum) => datum.figure || [])
      .enter()
      .append('div');

    if (enter.size() === 0) {
      figure.remove();
    }

    this._render(enter, (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
    });

    const secondary = details
      .append('div')
      .classed('secondary', true);

    const title = secondary
      .append('div')
      .classed('title', true);

    title
      .append('span')
      .classed('l1', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'l1', route });
      });

    title
      .append('span')
      .classed('l2', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'l2', route });
      });

    title
      .append('span')
      .classed('l3', true)
      .html((d, i, n) => {
        return this.format(d, i, n, { data, name: 'l3', route });
      });

    const actions = secondary
      .append('ul')
      .classed('actions', true)
      .selectAll('li')
      .data((datum) => datum.actions)
      .enter()
      .append('li')
      .attr('class', (datum) => datum.name);

    actions
      .filter((datum) => datum.button)
      .append('button')
      .attr('tabindex', 0)
      .attr('class', (datum) => 'button ' + datum.button);

    actions
      .append('span')
      .classed('label', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'action', route });
      });

    const state = summary
      .filter((datum) => {
        return datum && typeof datum.state !== 'undefined';
      })
      .append('div')
      .attr('class', (d, i, n) => {
        return 'state ' +
          (this.format(d, i, n, { data, name: 'state' }) || '');
      });

    state.append('span');
    state.append('span');
    state.append('span');

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
