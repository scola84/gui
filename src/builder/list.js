import { select } from 'd3';
import Builder from './builder';
import renderNav from '../helper/render/nav';

export default class ListBuilder extends Builder {
  constructor(options) {
    super(options);

    this._add = null;
    this._empty = null;

    this.setAdd(options.add);
    this.setEmpty(options.empty);
  }

  setAdd(value = true) {
    this._add = value;
    return this;
  }

  setEmpty(value = true) {
    this._empty = value;
    return this;
  }

  setRender(value = renderNav) {
    return super.setRender(value);
  }

  act(route, data, callback) {
    if (this._prepare) {
      this._prepareList(route, data);
    }

    if (this._finish) {
      route.list = this._finishList(route, data);
    }

    this.pass(route, data, callback);
  }

  _clearList(list, item) {
    item.remove();

    return list
      .selectAll('li');
  }

  _createDatum(datum) {
    const field = this._structure && this._structure[0] &&
      this._structure[0].fields[0] || {};
    const value = field.name ? datum[field.name] : datum;

    return { datum, field, value };
  }

  _finishData(item, data) {
    const update = item
      .data(data, (datum) => JSON.stringify(datum));

    const exit = update
      .exit();

    const enter = update
      .enter()
      .append('li')
      .datum((datum) => this._createDatum(datum));

    const empty = select();

    this._render(enter, (d, i, n, c) => {
      return this.format(d, i, n, c);
    });

    return { empty, enter, exit, update };
  }

  _finishEmpty(item) {
    const data = [];

    if (this._empty) {
      data.push({ field: { disabled: true, name: 'empty' } });
    }

    if (this._add) {
      data.push({ field: { dir: 'rtl', name: 'add' } });
    }

    const enter = select();

    const empty = item
      .data(data)
      .enter()
      .append('li');

    renderNav(empty, (d, i, n, c) => {
      return this.format(d, i, n, c);
    });

    return { empty, enter };
  }

  _finishList(route, data) {
    const panel = select(route.node);

    panel
      .select('.body .content')
      .classed('busy', false)
      .classed('done', data.length === 0);

    const number = panel
      .selectAll('div.list')
      .size() - 1;

    let list = panel
      .select('#' + this._createTarget('list', number))
      .selectAll('ul.list')
      .data([0]);

    list = list
      .enter()
      .append('ul')
      .classed('block list click', true)
      .merge(list);

    let item = list
      .selectAll('li');

    if (route.clear) {
      item = this._clearList(list, item);
    }

    if (item.size() === 0 && data.length === 0) {
      return this._finishEmpty(item);
    }

    return this._finishData(item, data);
  }

  _prepareList(route) {
    const number = select(route.node)
      .selectAll('div.list')
      .size();

    if (number > 0) {
      return;
    }

    select(route.node)
      .select('.body .content')
      .append('div')
      .attr('id', this._createTarget('list', number))
      .classed('list', true);
  }
}
