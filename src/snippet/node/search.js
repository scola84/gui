import defaults from 'lodash-es/defaultsDeep';
import { Node } from '../node';

export class Search extends Node {
  constructor(options) {
    super(options);

    this._wildcard = null;
    this.setWildcard(options.wildcard);
  }

  getWildcard() {
    return this._wildcard;
  }

  setWildcard(value = '*') {
    this._wildcard = value;
    return this;
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

    const input = this._node
      .append('input')
      .attr('autocomplete', 'on')
      .attr('minlength', 3)
      .attr('name', 'search')
      .attr('type', 'search');

    const value = sessionStorage.getItem('search-' + this._id);

    if (value) {
      this._node.classed('show', true);
      input.attr('value', value);

      defaults(box, {
        list: {
          search: this.formatSearch(value)
        }
      });
    }

    return this.resolveOuter(box, data);
  }

  resolveInput(box) {
    sessionStorage.setItem('search-' + this._id, box.input);

    box.list.clear = true;

    box.list.search = box.input ?
      this.formatSearch(box.input) :
      null;

    delete box.input;
    return this._node;
  }

  resolveToggle(box) {
    if (box.toggle) {
      this._node
        .select('input')
        .node()
        .focus();
    }

    this._node
      .classed('transition', true)
      .classed('show', box.toggle)
      .on('transitionend.scola', () => {
        this._node
          .classed('transition', false)
          .on('transitionend.scola', null);
      });

    delete box.toggle;

    return this._node;
  }
}
