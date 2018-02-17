import { select } from 'd3';
import Builder from './builder';
import renderList from '../helper/render/list';

export default class ListBuilder extends Builder {
  constructor(options) {
    super(options);

    this._add = null;
    this._dynamic = null;
    this._empty = null;

    this.setAdd(options.add);
    this.setDynamic(options.dynamic);
    this.setEmpty(options.empty);
  }

  setAdd(value = true) {
    this._add = value;
    return this;
  }

  setDynamic(value = true) {
    this._dynamic = value;
    return this;
  }

  setEmpty(value = true) {
    this._empty = value;
    return this;
  }

  setRender(value = renderList) {
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

  filter(box, data, context) {
    if (this._filter) {
      return this._filter(box, data, context);
    }

    return data.data || [];
  }

  _clearList(list, item) {
    item.remove();
    return list.selectAll('li');
  }

  _finishData(route, list, item, data) {
    const update = item
      .data(data, (datum) => JSON.stringify(datum));

    const exit = update
      .exit();

    const enter = update
      .enter()
      .append('li')
      .datum(list.datum());

    const empty = select();

    this._render(enter, (d, i, n, name) => {
      return this.format(d, i, n, { data: data[i], name, route });
    });

    return { empty, enter, exit, update };
  }

  _finishDynamic(route, list, item, data) {
    if (route.clear) {
      item = this._clearList(list, item);
    }

    if (item.size() === 0 && data.length === 0) {
      return this._finishEmpty(route, list, item);
    }

    return this._finishData(route, list, item, data);
  }

  _finishEmpty(route, list, item) {
    const data = [];

    if (this._empty) {
      data.push({ disabled: true, name: 'empty' });
    }

    if (this._add) {
      data.push({ name: 'add', route: ':rtl' });
    }

    const enter = select();

    const empty = item
      .data(data)
      .enter()
      .append('li');

    renderList(empty, (d, i, n, name) => {
      return this.format(d, i, n, { data: {}, name, route });
    });

    return { empty, enter };
  }

  _finishList(route, data = {}) {
    data = this.filter(route, data);

    const structure = typeof this._structure === 'function' ?
      this._structure(route, data) :
      (this._dynamic === true ?
        this._structure && this._structure[0].fields || [0] :
        this._structure);

    const panel = select(route.node);

    panel
      .select('.body .content')
      .classed('busy', false)
      .classed('done', data && data.length === 0);

    const number = panel
      .selectAll('div.list')
      .size() - 1;

    let list = panel
      .select('#' + this._createTarget('list', number))
      .selectAll('ul.list')
      .data(structure);

    list = list
      .enter()
      .append('ul')
      .classed('block list', true)
      .merge(list);

    list
      .filter((datum) => typeof datum.name !== 'undefined')
      .append('lt')
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'title', route });
      });

    const item = list
      .selectAll('li');

    if (this._dynamic === true) {
      return this._finishDynamic(route, list, item, data);
    }

    return this._finishStatic(route, list, item, data);
  }

  _finishStatic(route, list, item, data) {
    const update = item
      .data((datum) => datum.fields || datum);

    const exit = update
      .exit();

    const enter = update
      .enter()
      .append('li');

    const empty = select();

    this._render(enter, (d, i, n, name) => {
      return this.format(d, i, n, { data, name, route });
    });

    return { empty, enter, exit, update };
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
