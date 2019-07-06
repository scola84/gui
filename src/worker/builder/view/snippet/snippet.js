import { Worker } from '@scola/worker';
let id = 0;

export class Snippet {
  static attach(...args) {
    Worker.attach(...args);
  }

  constructor(options = {}) {
    this._allow = null;
    this._builder = null;
    this._id = null;
    this._list = null;
    this._node = null;
    this._parent = null;

    this.setAllow(options.allow);
    this.setBuilder(options.builder);
    this.setId(options.id);
    this.setList(options.list);
    this.setNode(options.node);
    this.setParent(options.parent);
  }

  clone() {
    const options = this.getOptions();

    options.list = options.list.map((snippet) => {
      return snippet instanceof Snippet ?
        snippet.clone() : snippet;
    });

    return new this.constructor(options);
  }

  getOptions() {
    return {
      allow: this._allow,
      builder: this._builder,
      id: this._id,
      list: this._list,
      parent: this._parent
    };
  }

  getAllow() {
    return this._allow;
  }

  setAllow(value = null) {
    this._allow = value;
    return this;
  }

  getBuilder() {
    return this._builder;
  }

  setBuilder(value = null) {
    this._builder = value;
    return this;
  }

  getId() {
    return this._id;
  }

  setId(value = ++id) {
    this._id = value;
    return this;
  }

  getList() {
    return this._list;
  }

  setList(value = []) {
    this._list = value;

    for (let i = 0; i < this._list.length; i += 1) {
      if (this._list[i] instanceof Snippet) {
        this._list[i].setParent(this);
      }
    }

    return this;
  }

  getNode() {
    return this._parent.getNode();
  }

  setNode(value = null) {
    this._node = value;
    return this;
  }

  getParent() {
    return this._parent;
  }

  setParent(value = null) {
    this._parent = value;
    return this;
  }

  allow(value) {
    return this.setAllow(value);
  }

  append(...list) {
    return this.setList(this._list.concat(list));
  }

  id(value) {
    return this.setId(value);
  }

  node() {
    return this.getNode();
  }

  find(compare) {
    const result = [];

    if (compare(this) === true) {
      result[result.length] = this;
    }

    return this.findRecursive(result, this._list, compare);
  }

  findRecursive(result, list, compare) {
    let snippet = null;

    for (let i = 0; i < list.length; i += 1) {
      snippet = list[i];

      if (snippet instanceof Snippet) {
        result = result.concat(snippet.find(compare));
      }
    }

    return result;
  }

  isAllowed(box, data) {
    return this.resolveValue(box, data, this._allow);
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
    const isAllowed = this.isAllowed(box, data);

    if (isAllowed === false) {
      return null;
    }

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

    if (value instanceof Snippet) {
      return this.resolveValue(box, data, value.resolve(box, data));
    }

    return value;
  }

  resolveObject(box, data, object, name) {
    object = this.resolveValue(box, data, object);
    return this.resolveValue(box, data, object[name]);
  }
}
