import { select } from 'd3';
import Builder from './builder';

import {
  renderMarkdown,
  renderSummary
} from '../helper';

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
      .select('#' + this._createTarget('summary', number))
      .datum(this._structure)
      .attr('class', (datum, index, nodes) => {
        return nodes[index].className + ' ' + datum.name;
      });

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

    const l0 = title
      .append('div')
      .classed('l0', true);

    renderMarkdown(l0, 'l0', (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
    });

    const l1 = title
      .append('div')
      .classed('l1', true);

    renderMarkdown(l1, 'l1', (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
    });

    const l2 = title
      .append('div')
      .classed('l2', true);

    renderMarkdown(l2, 'l2', (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
    });

    const l3 = title
      .append('div')
      .classed('l3', true);

    renderMarkdown(l3, 'l3', (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
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
        return 'states ' +
          (this.format(d, i, n, { data, name: 'state', route }) || '');
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
      .select('.body .content ' + this._wrap)
      .append('div')
      .attr('id', this._createTarget('summary', number))
      .classed('summary', true);
  }
}
