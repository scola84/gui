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
    Object.assign(this._attributes, value);
    return this;
  }

  getClassed() {
    return this._classed;
  }

  setClassed(value = {}) {
    Object.assign(this._classed, value);
    return this;
  }

  getHtml() {
    return this._html;
  }

  setHtml(value = null) {
    this._html = { html: value };
    return this;
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
    Object.assign(this._properties, value);
    return this;
  }

  getStyles() {
    return this._styles;
  }

  setStyles(value = {}) {
    Object.assign(this._styles, value);
    return this;
  }

  getText() {
    return this._text;
  }

  setText(value = null) {
    this._text = { text: value };
    return this;
  }

  attributes(value) {
    return this.setAttributes(value);
  }

  class(value) {
    return this.setClassed({
      [value]: true
    });
  }

  classed(value) {
    return this.setClassed(value);
  }

  html(value) {
    return this.setHtml(value);
  }

  id(value) {
    return this.setAttributes({
      id: value
    });
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
    this._node.remove();
    this._node.node().snippet = null;
    this._node = null;

    super.remove();
  }

  render(box, data) {
    if (this._node === null) {
      this._createNode();
    }

    this._renderBefore(box, data);
    this._renderNode(box, data);
    this._renderList(box, data);
    this._renderAfter(box, data);

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

  _renderAfter() {}

  _renderBefore() {}

  _renderList(box, data) {
    let snippets = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippets = this._list[i];
      snippets = this._resolve(snippets, box, data);
      snippets = Array.isArray(snippets) ? snippets : [snippets];

      for (let j = 0; j < snippets.length; j += 1) {
        this._insertNode(snippets[j].node());
      }
    }
  }

  _renderNode(box, data) {
    this._set(box, data, this._attributes, 'attr');
    this._set(box, data, this._classed, 'classed');
    this._set(box, data, this._html);
    this._set(box, data, this._properties, 'property');
    this._set(box, data, this._styles, 'style');
    this._set(box, data, this._text);
  }

  _set(box, data, values, name) {
    values = this._resolve(values, box, data);

    const keys = Object.keys(values);
    let key = null;

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];

      if (name) {
        this._node[name](key, this._resolve(values[key], box, data));
      } else {
        this._node[key](this._resolve(values[key], box, data));
      }
    }
  }
}
