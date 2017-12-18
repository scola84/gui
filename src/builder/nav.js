import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class NavBuilder extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._structure = null;
    this.setStructure(options.structure);
  }

  setStructure(value = null) {
    this._structure = value;
    return this;
  }

  act(route) {
    let list = select(route.node)
      .select('.body')
      .append('div')
      .classed('nav', true)
      .selectAll('ul')
      .data(this._structure);

    list = list
      .enter()
      .append('ul')
      .classed('block', true)
      .merge(list);

    list.each((section, index, nodes) => {
      if (section.name) {
        select(nodes[index])
          .append('lt')
          .text((d, i, n) => this._format(d, i, n, 'title'));
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
      .attr('href', '#')
      .attr('tabindex', 0)
      .text((d, i, n) => this.format(d, i, n, 'item'));

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
