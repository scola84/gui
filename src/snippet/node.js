import { select } from 'd3';
import Snippet from './snippet';

const states = {
  attr: 2 ** 0,
  classed: 2 ** 1,
  html: 2 ** 2,
  property: 2 ** 3,
  style: 2 ** 4,
  text: 2 ** 5,
  list: 2 ** 6
};

export default class Node extends Snippet {
  constructor(options) {
    super(options);

    this._attributes = null;
    this._classed = null;
    this._html = null;
    this._properties = null;
    this._styles = null;
    this._text = null;

    this.setAttributes(options.attributes);
    this.setClassed(options.classed);
    this.setHtml(options.html);
    this.setProperties(options.properties);
    this.setStyles(options.styles);
    this.setText(options.text);

    this._node = select(document.createElement(options.name));
  }

  setAttributes(value = {}) {
    this._attributes = value;
    return this;
  }

  setClassed(value = {}) {
    this._classed = value;
    return this;
  }

  setHtml(value = null) {
    this._html = value;
    return this;
  }

  setProperties(value = {}) {
    this._properties = value;
    return this;
  }

  setStyles(value = {}) {
    this._styles = value;
    return this;
  }

  setText(value = null) {
    this._text = value;
    return this;
  }

  node() {
    return this._node;
  }

  attributes(value = null) {
    this._attributes = value;
    return this;
  }

  classed(value = null) {
    this._classed = value;
    return this;
  }

  html(value = null) {
    this._html = value;
    return this;
  }

  properties(value = null) {
    this._properties = value;
    return this;
  }

  styles(value = null) {
    this._styles = value;
    return this;
  }

  text(value = null) {
    this._text = value;
    return this;
  }

  remove() {
    super.remove();
    this._node.remove();
  }

  render(box, data) {
    if ((this._state & states.list) > 0) {
      this._removeList(this._list);
    }

    this._renderItems('attr', this._attributes, box, data);
    this._renderItems('classed', this._classed, box, data);
    this._renderItems('property', this._properties, box, data);
    this._renderItems('style', this._styles, box, data);

    this._renderItem('html', this._html, box, data);
    this._renderItem('text', this._text, box, data);

    this._renderList(this._list, box, data);

    return this._node;
  }

  _renderItem(name, value, box, data) {
    this._node[name](this._resolve(value, box, data));
    this._state |= states[name];
  }

  _renderItems(name, values, box, data) {
    values = this._resolve(values, box, data);

    Object.keys(values).forEach((key) => {
      this._node[name](key, this._resolve(values[key], box, data));
    });

    this._state |= states[name];
  }

  _renderList(list, box, data) {
    list.forEach((item) => {
      item = this._resolve(item, box, data);
      item = Array.isArray(item) ? item : [item];
      item.forEach((child) => this._node.insert(() => {
        return child.node();
      }));
    });

    this._state |= states.list;
  }
}
