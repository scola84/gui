import { Worker } from '@scola/worker';
import { select } from 'd3';

export default class NavBuilder extends Worker {
  constructor(methods) {
    super(methods);

    this._format = (d) => d;
    this._items = null;
  }

  setFormat(value) {
    this._format = value;
    return this;
  }

  setItems(value) {
    this._items = value;
    return this;
  }

  act(route) {
    let list = select(route.node)
      .select('.body')
      .append('div')
      .classed('nav', true)
      .selectAll('ul')
      .data(this._items);

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

    const enter = list
      .selectAll('li')
      .data((section) => section.items)
      .enter()
      .append('li');

    enter.each((item, index, nodes) => {
      if (item.icon) {
        select(nodes[index])
          .classed('icon', true)
          .append('span')
          .classed('icon ' + item.icon, true);
      }
    });

    enter
      .append('a')
      .attr('tabindex', 0)
      .text(this._format);

    enter.each((item, index, nodes) => {
      if (item.dir === 'rtl') {
        select(nodes[index])
          .append('span')
          .classed('icon secondary ion-ios-arrow-forward', true);
      }
    });

    this.pass(route, { enter });
  }
}
