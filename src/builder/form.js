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

  _createDatum(route, data, field) {
    let value = field.value;

    if (typeof data[field.name] !== 'undefined') {
      value = data[field.name];
    } else if (typeof route.params[field.name] !== 'undefined') {
      value = route.params[field.name];
    }

    return { field, value };
  }

  _finishForm(route, data = {}) {
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
      .merge(list);

    list
      .filter((section) => typeof section.name !== 'undefined')
      .append('lt')
      .text((d, i, n) => this.format(d, i, n, { name: 'form.title' }));

    const enter = list
      .selectAll('li')
      .data((section) => section.fields)
      .enter()
      .append('li')
      .datum((field) => this._createDatum(route, data, field));

    this._render(enter, (d, i, n, c) => {
      return this.format(d, i, n, c);
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
