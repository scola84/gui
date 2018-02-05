import { select } from 'd3';
import Builder from './builder';
import renderForm from '../helper/render/form';

export default class FormBuilder extends Builder {
  setRender(value = renderForm) {
    return super.setRender(value);
  }

  act(route, data, callback) {
    if (this._prepare) {
      this._prepareForm(route, data);
    }

    if (this._finish) {
      route.form = this._finishForm(route, data);
    }

    this.pass(route, data, callback);
  }

  filter(box, data, context) {
    if (this._filter) {
      return this._filter(box, data, context);
    }

    return data.data || {};
  }

  _finishForm(route, data = {}) {
    data = this.filter(route, data);
    const panel = select(route.node);

    const number = panel
      .selectAll('form')
      .size() - 1;

    const form = panel
      .select('#' + this._createTarget('form', number));

    let list = form
      .selectAll('ul')
      .data(this._structure);

    list = list
      .enter()
      .append('ul')
      .classed('block', true)
      .classed('hidden', (datum) => datum.hidden)
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
      .append('li');

    this._render(enter, (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
    });

    return form;
  }

  _prepareForm(route) {
    const panel = select(route.node);

    const number = panel
      .selectAll('form')
      .size();

    panel
      .select('.body .content')
      .append('form')
      .attr('id', this._createTarget('form', number))
      .attr('novalidate', 'novalidate');
  }
}
