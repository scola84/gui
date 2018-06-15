import { select } from 'd3';
import Builder from './builder';
import renderKpi from '../helper/render/kpi';

export default class KpiBuilder extends Builder {
  setRender(value = renderKpi) {
    return super.setRender(value);
  }

  act(route, data, callback) {
    if (this._prepare) {
      this._prepareKpi(route, data);
    }

    if (this._finish) {
      this._finishKpi(route, data);
    }

    this.pass(route, data, callback);
  }

  _finishKpi(route, data) {
    data = this.filter(route, data);

    const structure = typeof this._structure === 'function' ?
      this._structure(route, data) :
      this._structure;

    const panel = select(route.node);

    const number = panel
      .selectAll('div.kpi')
      .size() - 1;

    const kpi = panel
      .select('#' + this._createTarget('kpi', number));

    kpi
      .select('div.block.kpi')
      .remove();

    const block = kpi
      .append('div')
      .classed('block kpi', true);

    block
      .append('div')
      .classed('title', true);

    const list = block
      .append('ul')
      .classed('body', true);

    let item = list
      .selectAll('li')
      .data(structure.fields);

    item = item
      .enter()
      .append('li');

    this._render(item, (d, i, n, name) => {
      return this.format(d, i, n, {
        data,
        name,
        route
      });
    });
  }

  _prepareKpi(route) {
    const panel = select(route.node);

    const target = panel
      .select('#' + this._target);

    if (target.size() > 0) {
      return;
    }

    const number = panel
      .selectAll('div.kpi')
      .size();

    panel
      .select('.body .content ' + this._wrap)
      .append('div')
      .attr('id', this._createTarget('kpi', number))
      .classed('kpi', true);
  }
}
