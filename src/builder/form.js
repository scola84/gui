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

    const form = select(route.node)
      .select('.body')
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

    list.each((section, index, nodes) => {
      if (section.name) {
        select(nodes[index])
          .append('lt')
          .text((d, i, n) => this.format(d, i, n, 'title'));
      }
    });

    let item = list
      .selectAll('li')
      .data((section) => section.fields);

    item = item
      .enter()
      .append('li')
      .merge(item);

    item.each((field, index, nodes) => {
      const node = select(nodes[index]);

      if (field.icon) {
        node
          .classed('icon', true)
          .append('span')
          .classed('icon ' + field.icon, true);
      }

      node
        .append('label')
        .attr('for', field.name)
        .text((d, i, n) => this.format(d, i, n, 'label'));

      if (field.type && input[field.type]) {
        input[field.type].create(node, field, data, (d, i, n, c) => {
          return this.format(d, i, n, c);
        });
      }

      if (field.button && button[field.button]) {
        button[field.button].create(node, field, data);
      }
    });

    this.pass(route, { form }, callback);
  }
}
