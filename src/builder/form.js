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

  _finishForm(route, data = {}) {
    data = this.filter(route, data);

    const structure = typeof this._structure === 'function' ?
      this._structure(route, data) :
      this._structure;

    const panel = select(route.node);

    const number = panel
      .selectAll('form')
      .size() - 1;

    const form = panel
      .select('#' + this._createTarget('form', number));

    let list = form
      .selectAll('div.block.form')
      .data(structure);

    const enter = list
      .enter()
      .append('div')
      .attr('class', (datum) => datum.class)
      .classed('block form', true)
      .classed('hidden', (datum) => datum.hidden);

    enter
      .append('div')
      .attr('class', (datum) => datum.fold ? 'fold' : null)
      .classed('title', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'title', route });
      })
      .on('click', (datum, index, nodes) => {
        if (datum.fold) {
          this._foldList(datum, index, nodes);
        }
      });

    enter
      .append('ul');

    enter
      .append('div')
      .classed('comment', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'comment', route });
      });

    list = list
      .merge(enter);

    const item = list
      .select('ul')
      .selectAll('li')
      .data((datum) => datum.fields)
      .enter()
      .append('li');

    this._render(item, (d, i, n, name) => {
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
