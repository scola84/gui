export default class Snippet {
  constructor(options = {}) {
    this._builder = null;
    this._list = null;

    this.setBuilder(options.builder);
    this.setList(options.list);
  }

  clone() {
    const options = this.getOptions();

    options.list = options.list.map((snippet) => {
      return snippet.clone();
    });

    return new this.constructor(options);
  }

  getOptions() {
    return {
      builder: this._builder,
      list: this._list
    };
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
    this.removeBefore();
  }

  removeAfter() {}

  removeBefore() {
    this.removeOuter();
  }

  removeInner() {
    for (let i = 0; i < this._list.length; i += 1) {
      this._list[i].remove();
    }

    this.removeAfter();
  }

  removeOuter() {
    this.removeInner();
  }

  resolve(box, data) {
    return this.resolveBefore(box, data);
  }

  resolveAfter() {}

  resolveBefore(box, data) {
    return this.resolveOuter(box, data);
  }

  resolveInner(box, data) {
    return this.resolveAfter(box, data);
  }

  resolveOuter(box, data) {
    return this.resolveInner(box, data);
  }

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
