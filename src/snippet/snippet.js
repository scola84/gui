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

  find(compare) {
    let result = [];

    if (compare(this) === true) {
      result[result.length] = this;
    }

    for (let i = 0; i < this._list.length; i += 1) {
      result = result.concat(this._list[i].find(compare));
    }

    return result;
  }

  remove() {
    this.removeList();
  }

  removeList() {
    for (let i = 0; i < this._list.length; i += 1) {
      this._list[i].remove();
    }
  }

  resolve() {}

  resolveValue(box, data, value) {
    if (value === null || typeof value === 'undefined') {
      return value;
    }

    if (typeof value === 'function') {
      return this.resolveValue(box, data, value(box, data));
    }

    if (typeof value.resolve === 'function') {
      return this.resolveValue(box, data, value.resolve(box, data));
    }

    return value;
  }

  resolveObject(box, data, object, name) {
    object = this.resolveValue(box, data, object);
    return this.resolveValue(box, data, object[name]);
  }
}