import { select } from 'd3';
import GraphicWorker from '../worker/graphic';
import button from './form/button';
import input from './form/input';

export default class FormBuilder extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._structure = null;
    this.setStructure(options.structure);
  }

  setStructure(value = null) {
    this._structure = value;
    return this;
  }

  act(route, data, callback) {
    const forms = select(route.node)
      .selectAll('.body>form');

    const body = select(route.node)
      .select('.body');

    const form = body
      .append('form');

    let list = form
      .attr('id', 'form-' + forms.size())
      .attr('novalidate', 'novalidate')
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
      .text((d, i, n) => this.format(d, i, n, 'title'));

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
      .text((d, i, n) => this.format(d, i, n, 'label'));

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

    this.pass(route, { form }, callback);
  }
}
