import { select } from 'd3';
import Snippet from './snippet';

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
    return this._setProperty('attributes', value);
  }

  getClassed() {
    return this._classed;
  }

  setClassed(value = {}) {
    return this._setProperty('classed', value);
  }

  getHtml() {
    return this._html;
  }

  setHtml(value = null) {
    return this._setProperty('html', { html: value });
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
    return this._setProperty('properties', value);
  }

  getStyles() {
    return this._styles;
  }

  setStyles(value = {}) {
    return this._setProperty('styles', value);
  }

  getText() {
    return this._text;
  }

  setText(value = null) {
    return this._setProperty('text', { text: value });
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

  query(query) {
    return this._node.select(query).node().snippet;
  }

  queryAll(query) {
    const all = [];

    this._node.selectAll(query).each((d, i, n) => {
      all[all.length] = n[i].snippet;
    });

    return all;
  }

  queryNext() {
    const node = this._node.node();

    if (node.nextSibling) {
      return node.nextSibling.snippet;
    }

    return null;
  }

  queryPrevious() {
    const node = this._node.node();

    if (node.previousSibling) {
      return node.previousSibling.snippet;
    }

    return null;
  }

  remove() {
    this._node.node().snippet = null;
    this._node.remove();
    this._node = null;

    super.remove();
  }

  resolve(box, data) {
    if (this._node === null) {
      this._createNode();
    }

    this._resolveBefore(box, data);
    this._resolveNode(box, data);
    this._resolveList(box, data);
    this._resolveAfter(box, data);

    return this._node;
  }

  _createNode() {
    this._node = select(
      document.createElement(this._name)
    );

    this._node.node().snippet = this;
  }

  _insertNode(node) {
    this._node.insert(() => node);
  }

  _resolveAfter() {}

  _resolveBefore() {}

  _resolveList(box, data) {
    let snippets = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippets = this._list[i];
      snippets = this._resolve(box, data, snippets);
      snippets = Array.isArray(snippets) ? snippets : [snippets];

      for (let j = 0; j < snippets.length; j += 1) {
        this._insertNode(snippets[j].node());
      }
    }
  }

  _resolveNode(box, data) {
    this._setNode(box, data, this._attributes, 'attr');
    this._setNode(box, data, this._classed, 'classed');
    this._setNode(box, data, this._html);
    this._setNode(box, data, this._properties, 'property');
    this._setNode(box, data, this._styles, 'style');
    this._setNode(box, data, this._text);
  }

  _setNode(box, data, values, name) {
    values = this._resolve(box, data, values);

    const keys = Object.keys(values);

    let key = null;
    let value = null;

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      value = this._resolve(box, data, values[key]);

      if (name) {
        this._node[name](key, value);
      } else {
        this._node[key](value);
      }
    }
  }

  _setProperty(name, value) {
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
