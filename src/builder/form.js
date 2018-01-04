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
      .filter((datum) => typeof datum.name !== 'undefined')
      .append('lt')
      .text((d, i, n) => this.format(d, i, n, { name: 'form.title' }));

    let item = list
      .selectAll('li')
      .data((datum) => datum.fields);

    item = item
      .enter()
      .append('li')
      .merge(item);

    item
      .filter((datum) => typeof datum.icon !== 'undefined')
      .classed('icon', true)
      .append('span')
      .attr('class', (datum) => 'icon ' + datum.icon);

    item
      .append('label')
      .attr('for', (datum) => datum.name)
      .text((d, i, n) => this.format(d, i, n, { name: 'form.label' }));

    item.each((datum, index, nodes) => {
      const node = select(nodes[index]);

      if (datum.type && input[datum.type]) {
        input[datum.type]
          .create(node, datum, data, (d, i, n, c) => {
            return this.format(d, i, n, c);
          })
          .attr('id', datum.name)
          .attr('name', datum.name)
          .attr('tabindex', 0);
      }

      if (datum.button && button[datum.button]) {
        button[datum.button].create(node, datum, data);
      }
    });

    return { form };
  }
}
