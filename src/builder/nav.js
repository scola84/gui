import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class NavBuilder extends GraphicWorker {
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

  act(route, data) {
    if (this._prepare) {
      this._prepareNav(route, data);
    }

    if (this._finish) {
      data = this._finishNav(route, data);
    }

    this.pass(route, data);
  }

  _prepareNav(route) {
    const id = this._id || select(route.node)
      .selectAll('.body>div.nav')
      .size();

    select(route.node)
      .select('.body')
      .append('div')
      .attr('id', 'nav-' + id)
      .classed('nav', true);
  }

  _finishNav(route, data = {}) {
    const id = this._id || select(route.node)
      .selectAll('.body>div.nav')
      .size() - 1;

    let list = select(route.node)
      .select('div.nav#nav-' + id)
      .selectAll('ul')
      .data(this._structure);

    list = list
      .enter()
      .append('ul')
      .classed('block', true)
      .merge(list);

    list
      .filter((datum) => typeof datum.name !== 'undefined')
      .append('lt')
      .text((d, i, n) => this.format(d, i, n, { name: 'nav.title' }));

    const enter = list
      .selectAll('li')
      .data((datum) => datum.items)
      .enter()
      .append('li')
      .datum((datum) => {
        return Object.assign({}, datum, data[datum.name]);
      })
      .attr('class', (datum) => datum.name);

    enter
      .filter((datum) => typeof datum.icon !== 'undefined')
      .classed('icon', true)
      .append('span')
      .attr('class', (datum) => 'icon ' + datum.icon);

    const primary = enter
      .append('div')
      .classed('primary', true);

    primary
      .append('button')
      .attr('tabindex', 0)
      .text((d, i, n) => this.format(d, i, n, { name: 'nav.label' }));

    primary
      .append('span')
      .text((d, i, n) => this.format(d, i, n, { name: 'nav.sub' }));

    const secondary = enter
      .append('div')
      .classed('secondary', true);

    secondary
      .append('span')
      .text((d, i, n) => this.format(d, i, n, { name: 'nav.value' }));

    secondary
      .filter((datum) => datum.dir === 'rtl')
      .append('span')
      .classed('icon ion-ios-arrow-forward', true);

    secondary
      .filter((datum) => typeof datum.button !== 'undefined')
      .append('button')
      .attr('tabindex', 0)
      .attr('class', (datum) => 'button ' + datum.button);

    return { enter };
  }
}
