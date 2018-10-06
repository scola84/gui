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

  _clearList(list, item) {
    item.remove();

    return list
      .select('ul')
      .selectAll('li');
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

    let structure = this._extract(route.structure || this._structure);

    if (typeof structure === 'function') {
      structure = structure(route, data);
    }

    structure = (this._dynamic === true ?
      structure && structure[0].fields || [0] :
      structure);

    const panel = select(route.node);

    panel
      .select('.body .content ' + this._wrap)
      .classed('busy', false)
      .classed('done', data && data.length === 0);

    const number = panel
      .selectAll('div.list-group')
      .size() - 1;

    let list = panel
      .select('#' + this._createTarget('list', number))
      .selectAll('div.block.list')
      .data(structure);

    const enter = list
      .enter()
      .append('div')
      .attr('class', (datum, index) => {
        return this._setFoldClass(route, datum, index);
      })
      .classed('block list', true);

    enter
      .append('div')
      .attr('class', (datum) => datum.fold ? 'fold' : null)
      .classed('title', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'title', route });
      })
      .on('click', (datum, index, nodes) => {
        this._foldList(route, datum, index, nodes);
      });

    enter
      .append('ul')
      .classed('body', true);

    enter
      .append('div')
      .classed('comment', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'comment', route });
      });

    list = list
      .merge(enter);

    const item = list
      .select('ul')
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

    this._setFoldHeight(list);

    return { empty, enter, exit, update };
  }

  _foldList(route, datum, index, nodes) {
    if (datum.fold !== true) {
      return;
    }

    const list = select(nodes[index].closest('.block'));
    const name = ['fold', route.path, index].join('-');
    const item = localStorage.getItem(name);

    const isFolded = item === null ?
      datum.folded === true : Number(item) === 1;

    localStorage.setItem(name, Number(!isFolded));

    let height = 0 +
      parseFloat(list.select('.title').style('border-top-width')) +
      parseFloat(list.select('.title').style('border-bottom-width')) +
      parseFloat(list.select('.body').style('border-top-width'));

    let node = null;
    const selector = isFolded ? 'ul,.comment,.title' : '.title';

    list.selectAll(selector).each((d, i, n) => {
      node = select(n[i]);

      height += n[i].getBoundingClientRect().height +
        parseFloat(node.style('margin-top')) +
        parseFloat(node.style('margin-bottom'));
    });

    list
      .style('height', height ? height + 'px' : null)
      .classed('folded', !isFolded);
  }

  _prepareList(route) {
    const panel = select(route.node);

    const number = panel
      .selectAll('div.list-group')
      .size();

    if (this._dynamic === true && number === 1) {
      return;
    }

    const target = panel
      .select('#' + this._target);

    if (target.size() > 0) {
      return;
    }

    select(route.node)
      .select('.body .content ' + this._wrap)
      .append('div')
      .attr('id', this._createTarget('list', number))
      .classed('list-group', true);
  }

  _setFoldClass(route, datum, index) {
    const base = datum.class || '';
    const name = ['fold', route.path, index].join('-');
    const item = localStorage.getItem(name);

    const isFolded = item === null ?
      datum.folded === true : Number(item) === 1;

    return base + (isFolded ? ' folded' : '');
  }

  _setFoldHeight(list) {
    setTimeout(() => {
      list.style('height', (datum, index, nodes) => {
        return datum.fold ? select(nodes[index]).style('height') : null;
      });
    });
  }
}
