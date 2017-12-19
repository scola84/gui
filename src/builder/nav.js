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

    list
      .filter((section) => typeof section.name !== 'undefined')
      .append('lt')
      .text((d, i, n) => this.format(d, i, n, 'title'));

    const enter = list
      .selectAll('li')
      .data((section) => section.items)
      .enter()
      .filter((d, i, n) => this.filter(d, i, n))
      .append('li');

    enter
      .filter((item) => typeof item.icon !== 'undefined')
      .classed('icon', true)
      .append('span')
      .attr('class', (item) => 'icon ' + item.icon);

    enter
      .append('a')
      .attr('href', '#')
      .attr('tabindex', 0)
      .text((d, i, n) => this.format(d, i, n, 'item'));

    enter
      .filter((item) => item.dir === 'rtl')
      .append('span')
      .classed('icon secondary ion-ios-arrow-forward', true);

    list
      .filter((section, index, nodes) => {
        return select(nodes[index]).selectAll('li').size() === 0;
      })
      .remove();

    this.pass(route, { enter });
  }
}
