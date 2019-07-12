import defaults from 'lodash-es/defaultsDeep';
import { Node } from '../node';

export class Search extends Node {
  constructor(options = {}) {
    super(options);

    this._placeholder = null;
    this._storage = null;
    this._wildcard = null;

    this.setPlaceholder(options.placeholder);
    this.setStorage(options.storage);
    this.setWildcard(options.wildcard);

    this.class('transition');
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      storage: this._storage,
      wildcard: this._wildcard
    });
  }

  getPlaceholder() {
    return this._placeholder;
  }

  setPlaceholder(value = null) {
    this._placeholder = value;
    return this;
  }

  getStorage() {
    return this._storage;
  }

  setStorage(value = localStorage) {
    this._storage = value;
    return this;
  }

  getWildcard() {
    return this._wildcard;
  }

  setWildcard(value = '*') {
    this._wildcard = value;
    return this;
  }

  placeholder(value) {
    return this.setPlaceholder(value);
  }

  storage(value) {
    return this.setStorage(value);
  }

  wildcard(value) {
    return this.setWildcard(value);
  }

  formatSearch(value) {
    const parts = value.match(/[^"\s]+|"[^"]+"/g);

    let match = null;
    let part = null;

    for (let i = 0; i < parts.length; i += 1) {
      part = parts[i];
      match = part.match(/".+"/);

      if (match === null) {
        parts[i] = this._wildcard + part + this._wildcard;
      }
    }

    return parts.join(' ');
  }

  resolveBefore(box, data) {
    if (typeof box.input !== 'undefined') {
      return this.resolveInput(box, data);
    }

    if (typeof box.toggle !== 'undefined') {
      return this.resolveToggle(box, data);
    }

    return this.resolveSearch(box, data);
  }

  resolveInput(box) {
    this._storage.setItem('search-' + this._id, box.input);

    box.list.clear = true;

    box.list.search = box.input ?
      this.formatSearch(box.input) :
      null;

    delete box.input;
    return this._node;
  }

  resolveSearch(box, data) {
    const placeholder = this.resolveValue(box, data, this._placeholder);

    const input = this._node
      .append('input')
      .attr('autocomplete', 'on')
      .attr('name', 'search')
      .attr('type', 'search')
      .attr('placeholder', placeholder);

    const value = this._storage.getItem('search-' + this._id);

    if (value) {
      this._node.classed('in', true);
      input.attr('value', value);

      defaults(box, {
        list: {
          search: this.formatSearch(value)
        }
      });
    }

    return this.resolveOuter(box, data);
  }

  resolveToggle(box) {
    const mustIn = !this._node.classed('in');

    if (mustIn) {
      this._node
        .select('input')
        .node()
        .focus();
    }

    this._node.classed('in', mustIn);

    delete box.toggle;
    return this._node;
  }
}
