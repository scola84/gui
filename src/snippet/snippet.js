export default class Snippet {
  constructor(options = {}) {
    this._list = null;
    this.setList(options.list);
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
    this._removeList(this._list);
  }

  _removeList(list) {
    list.forEach((item) => {
      if (typeof item.remove === 'function') {
        item.remove();
      }
    });
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
