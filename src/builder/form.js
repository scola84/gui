import { Worker } from '@scola/worker';
import { select } from 'd3';
import button from './form/button';
import input from './form/input';

export default class FormBuilder extends Worker {
  constructor(methods) {
    super(methods);

    this._structure = null;
    this._format = (d) => d;
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
      .selectAll('ul')
      .data(this._structure
        .filter((section) => section.fields));

    list = list
      .enter()
      .append('ul')
      .classed('list', true)
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
      if (field.icon) {
        select(nodes[index])
          .classed('icon', true)
          .append('span')
          .classed('icon ' + field.icon, true);
      }
    });

    item
      .append('label')
      .attr('for', (field) => field.name)
      .text(this._format);

    item.each((field, index, node) => {
      if (field.type && input[field.type]) {
        input[field.type].create(select(node[index]), field, data);
      }
    });

    item.each((field, index, node) => {
      if (field.button && button[field.button]) {
        button[field.button].create(select(node[index]), field, data);
      }
    });

    this.pass(route, data, callback);
  }

  err(route) {
    select(route.node)
      .select('.bar label[for]')
      .attr('tabindex', null)
      .classed('disabled', true);
  }
}
