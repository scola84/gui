import { select } from 'd3';
import ListBuilder from './list';
import renderForm from '../helper/render/form';
import renderMarkdown from '../helper/render/markdown';

export default class FormBuilder extends ListBuilder {
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

    let structure = this._extract(route.structure || this._structure);

    if (typeof structure === 'function') {
      structure = structure(route, data);
    }

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
      .attr('class', (datum, index) => {
        return this._setFoldClass(route, datum, index);
      })
      .classed('block form', true)
      .classed('hidden', (datum) => datum.hidden);

    enter
      .append('div')
      .attr('class', (datum) => datum.fold ? 'fold' : null)
      .classed('title', true)
      .text((d, i, n) => {
        return d.text || this.format(d, i, n, { data, name: 'title', route });
      })
      .on('click', (datum, index, nodes) => {
        this._foldList(route, datum, index, nodes);
      });

    enter
      .append('ul')
      .classed('body', true);

    const comment = enter
      .append('div')
      .classed('comment', true);

    renderMarkdown(comment, 'comment', (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
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

    this._setFoldHeight(list);

    return form;
  }

  _prepareForm(route) {
    const panel = select(route.node);

    const target = panel
      .select('#' + this._target);

    if (target.size() > 0) {
      return;
    }

    const number = panel
      .selectAll('form')
      .size();

    panel
      .select('.body .content ' + this._wrap)
      .append('form')
      .attr('id', this._createTarget('form', number))
      .attr('novalidate', 'novalidate');
  }
}
