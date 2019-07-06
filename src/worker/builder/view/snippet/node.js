import { select } from 'd3';
import { Snippet } from './snippet';
import { Dummy } from '../../../../object';

export class Node extends Snippet {
  constructor(options = {}) {
    super(options);

    this._name = null;
    this._transform = [];

    this.setName(options.name);
    this.setTransform(options.transform);

    if (options.class) {
      this.class(options.class);
    }
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      name: this._name,
      transform: this._transform
    });
  }

  getName() {
    return this._name;
  }

  getNode() {
    return this._node;
  }

  setName(value = 'div') {
    this._name = value;
    return this;
  }

  getTransform() {
    return this._transform;
  }

  setTransform(value = []) {
    this._transform = value;
    return this;
  }

  attributes(values) {
    return this.transform((box, data, node) => {
      this.resolveEach(box, data, values, (key, value) => {
        node.attr(key, value);
      });
    });
  }

  classed(values) {
    return this.transform((box, data, node) => {
      this.resolveEach(box, data, values, (key, value) => {
        node.classed(key, value);
      });
    });
  }

  html(value) {
    return this.transform((box, data, node) => {
      node.html(this.resolveValue(box, data, value));
    });
  }

  properties(values) {
    return this.transform((box, data, node) => {
      this.resolveEach(box, data, values, (key, value) => {
        node.property(key, value);
      });
    });
  }

  styles(values) {
    return this.transform((box, data, node) => {
      this.resolveEach(box, data, values, (key, value) => {
        node.style(key, value);
      });
    });
  }

  text(value) {
    return this.transform((box, data, node) => {
      node.text(this.resolveValue(box, data, value));
    });
  }

  class(value) {
    return this.classed({
      [value]: true
    });
  }

  name(value) {
    return this.setName(value);
  }

  transform(...transform) {
    this._transform = this._transform.concat(transform);
    return this;
  }

  createNode() {
    this._node = this._parent === null ?
      select('body').append(this._name).remove() :
      this._parent.node().append(this._name);

    this._node.node().snippet = this;
  }

  removeNode() {
    if (this._node === null) {
      return;
    }

    this._node.node().snippet = null;
    this._node.remove();
    this._node = null;
  }

  wrapNode(name) {
    const node = this._node.node();
    const wrapper = document.createElement(name);

    node.parentNode.insertBefore(wrapper, node);
    wrapper.appendChild(node);

    return select(wrapper);
  }

  removeOuter() {
    this.removeNode();
    this.removeInner();
  }

  resolve(box, data) {
    const isAllowed = this.isAllowed(box, data);

    if (isAllowed === false) {
      return null;
    }

    if (this._node === null) {
      this.createNode();
    }

    return this.resolveBefore(box, data);
  }

  resolveAfter() {
    return this._node;
  }

  resolveAttribute(box, data, name) {
    let node = this._node;

    if (node === null) {
      node = new Dummy();
      this.resolveTransform(box, data, node);
    }

    return node.attr(name);
  }

  resolveBefore(box, data) {
    return this.resolveOuter(box, data);
  }

  resolveEach(box, data, object, callback) {
    object = this.resolveValue(box, data, object);

    const keys = Object.keys(object);
    let key = null;

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      callback(key, this.resolveValue(box, data, object[key]));
    }
  }

  resolveInner(box, data) {
    for (let i = 0; i < this._list.length; i += 1) {
      this.resolveValue(box, data, this._list[i]);
    }

    return this.resolveAfter(box, data);
  }

  resolveOuter(box, data) {
    this.resolveTransform(box, data, this._node);
    return this.resolveInner(box, data);
  }

  resolveTransform(box, data, node) {
    for (let i = 0; i < this._transform.length; i += 1) {
      this._transform[i](box, data, node);
    }
  }
}
