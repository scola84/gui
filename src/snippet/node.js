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
    return this._setOwnProperty('attributes', value);
  }

  getClassed() {
    return this._classed;
  }

  setClassed(value = {}) {
    return this._setOwnProperty('classed', value);
  }

  getHtml() {
    return this._html;
  }

  setHtml(value) {
    return this._setOwnProperty('html', { html: value });
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
    return this._setOwnProperty('properties', value);
  }

  getStyles() {
    return this._styles;
  }

  setStyles(value = {}) {
    return this._setOwnProperty('styles', value);
  }

  getText() {
    return this._text;
  }

  setText(value) {
    return this._setOwnProperty('text', { text: value });
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

  create() {
    this._node = select(
      document.createElement(this._name)
    );

    this._node.node().snippet = this;
  }

  query(query) {
    return new Query({
      list: [query],
      node: this._node
    });
  }

  remove() {
    this.removeNode();
    super.remove();
  }

  removeNode() {
    this._node.node().snippet = null;
    this._node.remove();
    this._node = null;
  }

  resolve(box, data) {
    if (typeof box === 'undefined') {
      return this;
    }

    if (this._node === null) {
      this.create();
    }

    this.resolveBefore(box, data);
    this.resolveOuter(box, data);
    this.resolveInner(box, data);
    this.resolveAfter(box, data);

    return this._node;
  }

  resolveAfter() {}

  resolveAttribute(box, data, name) {
    return this.resolveObject(box, data, this._attributes, name);
  }

  resolveBefore() {}

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
        this._insertNode(snippets[j].node());
      }
    }
  }

  resolveOuter(box, data) {
    this._setOuter(box, data, this._attributes, 'attr');
    this._setOuter(box, data, this._classed, 'classed');
    this._setOuter(box, data, this._html);
    this._setOuter(box, data, this._properties, 'property');
    this._setOuter(box, data, this._styles, 'style');
    this._setOuter(box, data, this._text);
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

  _insertNode(node) {
    this._node.insert(() => node);
  }

  _setOuter(box, data, values, name) {
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

  _setOwnProperty(name, value) {
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
