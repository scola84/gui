import { select } from 'd3';
import GraphicWorker from '../worker/graphic';
import button from './form/button';
import input from './form/input';

export default class FormBuilder extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._finish = null;
    this._id = null;
    this._prepare = null;
    this._structure = null;

    this.setFinish(options.finish);
    this.setId(options.id);
    this.setPrepare(options.prepare);
    this.setStructure(options.structure);
  }

  setFinish(value = true) {
    this._finish = value;
    return this;
  }

  setId(value = null) {
    this._id = value;
    return this;
  }

  setPrepare(value = true) {
    this._prepare = value;
    return this;
  }

  setStructure(value = null) {
    this._structure = value;
    return this;
  }

  act(route, data, callback) {
    if (this._prepare) {
      this._prepareForm(route, data);
    }

    if (this._finish) {
      data = this._finishForm(route, data);
    }

    this.pass(route, data, callback);
  }

  _prepareForm(route) {
    const id = this._id || select(route.node)
      .selectAll('.body>form')
      .size();

    select(route.node)
      .select('.body')
      .append('form')
      .attr('id', 'form-' + id)
      .attr('novalidate', 'novalidate');
  }

  _finishForm(route, data = {}) {
    const id = this._id || select(route.node)
      .selectAll('.body>form')
      .size() - 1;

    const body = select(route.node)
      .select('.body');

    const form = select(route.node)
      .select('form#form-' + id);

    let list = form
      .selectAll('ul')
      .data(this._structure.filter((section) => section.fields));

    list = list
      .enter()
      .append('ul')
      .classed('block', true)
      .merge(list);

    list
      .filter((section) => typeof section.name !== 'undefined')
      .append('lt')
      .text((d, i, n) => this.format(d, i, n, { name: 'form.title' }));

    let item = list
      .selectAll('li')
      .data((section) => section.fields);

    item = item
      .enter()
      .append('li')
      .merge(item);

    item
      .filter((field) => typeof field.icon !== 'undefined')
      .classed('icon', true)
      .append('span')
      .attr('class', (field) => 'icon ' + field.icon);

    item
      .append('label')
      .attr('for', (field) => field.name)
      .text((d, i, n) => this.format(d, i, n, { name: 'form.label' }));

    const disabled = body.classed('disabled') ? 'disabled' : null;

    item.each((field, index, nodes) => {
      const node = select(nodes[index]);

      if (field.type && input[field.type]) {
        input[field.type]
          .create(node, field, data, (d, i, n, c) => {
            return this.format(d, i, n, c);
          })
          .attr('disabled', disabled)
          .attr('id', field.name)
          .attr('name', field.name)
          .attr('tabindex', 0);
      }

      if (field.button && button[field.button]) {
        button[field.button].create(node, field, data);
      }
    });

    return { form };
  }
}
