import { Worker } from '@scola/worker';
import { select } from 'd3';
import button from './form/button';
import input from './form/input';

export default class FormBuilder extends Worker {
  constructor(methods) {
    super(methods);

    this._structure = null;
    this._format = (datum) => datum.name;
  }

  setStructure(value) {
    this._structure = value;
    return this;
  }

  setFormat(value) {
    this._format = value;
    return this;
  }

  act(route, data, callback) {
    let list = select(route.node)
      .select('.body')
      .append('form')
      .attr('novalidate', 'novalidate')
      .selectAll('ul')
      .data(this._structure
        .filter((section) => section.fields));

    list = list
      .enter()
      .append('ul')
      .classed('block', true)
      .merge(list);

    list.each((section, index, nodes) => {
      if (section.name) {
        select(nodes[index])
          .append('lt')
          .text(this._format);
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

      if (field.label !== false) {
        node
          .append('label')
          .attr('for', field.name)
          .text(this._format);
      }

      if (field.type && input[field.type]) {
        input[field.type].create(node, field, data, this._format);
      }

      if (field.button && button[field.button]) {
        button[field.button].create(node, field, data);
      }
    });

    this.pass(route, data, callback);
  }
}
