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

  resolve() {}

  _removeList() {
    for (let i = 0; i < this._list.length; i += 1) {
      this._list[i].remove();
    }
  }

  _resolve(box, data, value) {
    if (value === null || typeof value === 'undefined') {
      return null;
    }

    if (typeof value === 'function') {
      return this._resolve(box, data, value(box, data));
    }

    if (typeof value.resolve === 'function') {
      return value.resolve(box, data);
    }

    return value;
  }

  _resolveValue(box, data, object, name) {
    object = this._resolve(box, data, object);
    return this._resolve(box, data, object[name]);
  }
}
