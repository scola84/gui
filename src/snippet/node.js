import { select } from 'd3';
import { Snippet } from './snippet';
import { Dummy } from '../helper';

export class Node extends Snippet {
  constructor(options = {}) {
    super(options);

    this._name = null;
    this._node = null;
    this._transforms = [];

    this.setName(options.name);
    this.setNode(options.node);
    this.setTransforms(options.transforms);

    if (options.class) {
      this.class(options.class);
    }

    if (options.id) {
      this.id(options.id);
    }
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      name: this._name,
      transforms: this._transforms
    });
  }

  getName() {
    return this._name;
  }

  setName(value = 'div') {
    this._name = value;
    return this;
  }

  getNode() {
    return this._node;
  }

  setNode(value = null) {
    this._node = value;
    return this;
  }

  getTransforms() {
    return this._transforms;
  }

  setTransforms(value = []) {
    this._transforms = value;
    return this;
  }

  attributes(values) {
    return this.transform((box, data, node) => {
      this.each(box, data, values, (key, value) => {
        node.attr(key, value);
      });
    });
  }

  class(value) {
    return this.classed({
      [value]: true
    });
  }

  classed(values) {
    return this.transform((box, data, node) => {
      this.each(box, data, values, (key, value) => {
        node.classed(key, value);
      });
    });
  }

  html(value) {
    return this.transform((box, data, node) => {
      node.html(this.resolveValue(box, data, value));
    });
  }

  id(value) {
    return this.attributes({
      id: value
    });
  }

  name(value) {
    return this.setName(value);
  }

  node() {
    return this.getNode();
  }

  properties(values) {
    return this.transform((box, data, node) => {
      this.each(box, data, values, (key, value) => {
        node.property(key, value);
      });
    });
  }

  styles(values) {
    return this.transform((box, data, node) => {
      this.each(box, data, values, (key, value) => {
        node.style(key, value);
      });
    });
  }

  text(value) {
    return this.transform((box, data, node) => {
      node.text(this.resolveValue(box, data, value));
    });
  }

  transform(value) {
    this._transforms[this._transforms.length] = value;
    return this;
  }

  createNode() {
    this._node = select(
      document.createElement(this._name)
    );

    this._node.node().snippet = this;
  }

  insertNode(node) {
    this._node.insert(() => node);
  }

  each(box, data, object, callback) {
    object = this.resolveValue(box, data, object);

    const keys = Object.keys(object);
    let key = null;

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      callback(key, this.resolveValue(box, data, object[key]));
    }
  }

  removeOuter() {
    this._node.node().snippet = null;
    this._node.remove();
    this._node = null;

    this.removeInner();
  }

  resolve(box, data) {
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
      this.resolveTransforms(box, data, node);
    }

    return node.attr(name);
  }

  resolveBefore(box, data) {
    return this.resolveOuter(box, data);
  }

  resolveInner(box, data) {
    let nodes = null;

    for (let i = 0; i < this._list.length; i += 1) {
      nodes = this.resolveValue(box, data, this._list[i]);
      nodes = Array.isArray(nodes) ? nodes : [nodes];

      for (let j = 0; j < nodes.length; j += 1) {
        this.insertNode(nodes[j].node());
      }
    }

    return this.resolveAfter(box, data);
  }

  resolveOuter(box, data) {
    this.resolveTransforms(box, data, this._node);
    return this.resolveInner(box, data);
  }

  resolveTransforms(box, data, node) {
    for (let i = 0; i < this._transforms.length; i += 1) {
      this._transforms[i](box, data, node);
    }
  }
}
