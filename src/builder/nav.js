import { select } from 'd3';
import Builder from './builder';
import renderNav from '../helper/render/nav';

export default class NavBuilder extends Builder {
  setRender(value = renderNav) {
    return super.setRender(value);
  }

  act(route, data, callback) {
    if (this._prepare) {
      this._prepareNav(route, data);
    }

    if (this._finish) {
      route.nav = this._finishNav(route, data);
    }

    this.pass(route, data, callback);
  }

  _finishNav(route, data = {}) {
    const panel = select(route.node);

    const number = panel
      .selectAll('div.nav')
      .size() - 1;

    let list = panel
      .select('#' + this._createTarget('nav', number))
      .selectAll('ul')
      .data(this._structure);

    list = list
      .enter()
      .append('ul')
      .classed('block click', true)
      .merge(list);

    list
      .filter((datum) => typeof datum.name !== 'undefined')
      .append('lt')
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'title', route });
      });

    const enter = list
      .selectAll('li')
      .data((datum) => datum.fields)
      .enter()
      .append('li')
      .attr('class', (datum) => datum.name);

    this._render(enter, (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
    });

    return { enter };
  }

  _prepareNav(route) {
    const panel = select(route.node);

    const number = panel
      .selectAll('div.nav')
      .size();

    panel
      .select('.body .content')
      .append('div')
      .attr('id', this._createTarget('nav', number))
      .classed('nav', true);
  }
}
