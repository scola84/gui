import { select } from 'd3';
import Snippet from './snippet';
import Query from './snippet/query';

export default class Node extends Snippet {
  constructor(options) {
    super(options);

    this._attributes = {};
    this._classed = {};
    this._html = {};
    this._name = null;
    this._node = null;
    this._properties = {};
    this._styles = {};
    this._text = {};

    this.setAttributes(options.attributes);
    this.setClassed(options.classed);
    this.setHtml(options.html);
    this.setName(options.name);
    this.setProperties(options.properties);
    this.setStyles(options.styles);
    this.setText(options.text);
  }

  getAttributes() {
    return this._attributes;
  }

  setAttributes(value = {}) {
    return this.setOwnProperty('attributes', value);
  }

  getClassed() {
    return this._classed;
  }

  setClassed(value = {}) {
    return this.setOwnProperty('classed', value);
  }

  getHtml() {
    return this._html;
  }

  setHtml(value) {
    return this.setOwnProperty('html', { html: value });
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

  getProperties() {
    return this._properties;
  }

  setProperties(value = {}) {
    return this.setOwnProperty('properties', value);
  }

  getStyles() {
    return this._styles;
  }

  setStyles(value = {}) {
    return this.setOwnProperty('styles', value);
  }

  getText() {
    return this._text;
  }

  setText(value) {
    return this.setOwnProperty('text', { text: value });
  }

  attributes(value) {
    return this.setAttributes(value);
  }

  classed(value) {
    return this.setClassed(value);
  }

  html(value) {
    return this.setHtml(value);
  }

  node() {
    return this.getNode();
  }

  properties(value) {
    return this.setProperties(value);
  }

  styles(value) {
    return this.setStyles(value);
  }

  text(value) {
    return this.setText(value);
  }

  class(value) {
    return this.setClassed({
      [value]: true
    });
  }

  id(value) {
    return this.setAttributes({
      id: value
    });
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

  query(query) {
    return new Query({
      list: [query],
      node: this._node
    });
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

    this.resolveBefore(box, data);

    return this._node;
  }

  resolveAttribute(box, data, name) {
    return this.resolveObject(box, data, this._attributes, name);
  }

  resolveClassed(box, data, name) {
    return this.resolveObject(box, data, this._classed, name);
  }

  resolveHtml(box, data) {
    return this.resolveObject(box, data, this._html, 'html');
  }

  resolveInner(box, data) {
    let snippets = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippets = this._list[i];
      snippets = this.resolveValue(box, data, snippets);
      snippets = Array.isArray(snippets) ? snippets : [snippets];

      for (let j = 0; j < snippets.length; j += 1) {
        this.insertNode(snippets[j].node());
      }
    }

    this.resolveAfter(box, data);
  }

  resolveOuter(box, data) {
    this.setOuter(box, data, this._attributes, 'attr');
    this.setOuter(box, data, this._classed, 'classed');
    this.setOuter(box, data, this._html);
    this.setOuter(box, data, this._properties, 'property');
    this.setOuter(box, data, this._styles, 'style');
    this.setOuter(box, data, this._text);

    this.resolveInner(box, data);
  }

  resolveProperty(box, data, name) {
    return this.resolveObject(box, data, this._properties, name);
  }

  resolveStyle(box, data, name) {
    return this.resolveObject(box, data, this._styles, name);
  }

  resolveText(box, data) {
    return this.resolveObject(box, data, this._text, 'text');
  }

  setOuter(box, data, values, name) {
    values = this.resolveValue(box, data, values);

    const keys = Object.keys(values);
    let key = null;

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];

      const value = this.resolveValue(box, data, values[key]);

      if (typeof value !== 'undefined') {
        if (name) {
          this._node[name](key, value);
        } else {
          this._node[key](value);
        }
      }
    }
  }

  setOwnProperty(name, value) {
    if (
      typeof value === 'function' ||
      typeof this['_' + name] === 'function'
    ) {
      this['_' + name] = value;
    } else {
      Object.assign(this['_' + name], value);
    }

    return this;
  }
}
