export default class Snippet {
  constructor(options = {}) {
    this._builder = null;
    this._list = null;

    this.setBuilder(options.builder);
    this.setList(options.list);
  }

  getBuilder() {
    return this._builder;
  }

  setBuilder(value = null) {
    this._builder = value;
    return this;
  }

  getList() {
    return this._list;
  }

  setList(value = []) {
    this._list = value;
    return this;
  }

  append(...list) {
    this._list = this._list.concat(list);
    return this;
  }

  remove() {
    this._removeList();
  }

  _removeList() {
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];

      if (typeof snippet.remove === 'function') {
        snippet.remove();
      }
    }
  }

  _resolve(value, box, data) {
    if (value === null || typeof value === 'undefined') {
      return null;
    }

    if (typeof value === 'function') {
      return this._resolve(value(box, data), box, data);
    }

    if (typeof value.render === 'function') {
      return value.render(box, data);
    }

    return value;
  }
}
