import { select } from 'd3';
import { Event } from '../event';

export class Fold extends Event {
  constructor(options = {}) {
    super(options);

    this._filter = null;
    this._storage = null;

    this.setFilter(options.filter);
    this.setStorage(options.storage);

    this.name('click');
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      filter: this._filter,
      storage: this._storage
    });
  }

  getFilter() {
    return this._filter;
  }

  setFilter(value = null) {
    this._filter = value;
    return this;
  }

  getStorage() {
    return this._storage;
  }

  setStorage(value = localStorage) {
    this._storage = value;
    return this;
  }

  filter(value) {
    return this.setFilter(value);
  }

  storage(value) {
    return this.setStorage(value);
  }

  resolveAfter(box, data) {
    const result = [];
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];

      this.load(box, data, snippet);
      this.fold(box, data, snippet);

      result[result.length] = snippet.node();
    }

    return result;
  }

  handle(box, data, snippet, event) {
    if (select(event.target).classed('fold handle') === true) {
      this.fold(box, data, snippet);
      this.save(box, data, snippet);
    }

    return false;
  }

  attach(node) {
    node.style('left');

    node
      .classed('transition', true)
      .classed('out', false)
      .on('transitionend.scola-fold', () => {
        node
          .classed('transition', false)
          .style('height', null)
          .on('transitionend.scola-fold', null);
      });
  }

  detach(node) {
    const height = node.node().getBoundingClientRect().height;

    node.style('height', height);
    node.style('left');

    node
      .classed('transition', true)
      .classed('out', true)
      .on('transitionend.scola-fold', () => {
        node
          .classed('transition', false)
          .on('transitionend.scola-fold', null)
          .remove();
      });

    if (height === 0) {
      node.dispatch('transitionend');
    }
  }

  fold(box, data, snippet) {
    const node = snippet.node();
    const classed = node.classed('folded');
    const snippets = this._filter(snippet);

    node.classed('folded', !classed);

    if (classed) {
      this.show(snippets);
    } else {
      this.hide(snippets);
    }
  }

  hide(snippets) {
    let node = null;

    for (let i = 0; i < snippets.length; i += 1) {
      node = snippets[i].node();

      node.next = node.node().nextSibling;
      node.parent = node.node().parentNode;

      this.detach(node);
    }
  }

  load(box, data, snippet) {
    const key = `fold-${this._id}`;
    const folded = Boolean(Number(this._storage.getItem(key)));

    snippet.node().classed('folded', !folded);
  }

  save(box, data, snippet) {
    const key = `fold-${this._id}`;
    const folded = snippet.node().classed('folded');

    this._storage.setItem(key, Number(folded));
  }

  show(snippets) {
    let node = null;

    for (let i = snippets.length - 1; i >= 0; i -= 1) {
      node = snippets[i].node();

      if (node.parent) {
        if (node.next) {
          node.parent.insertBefore(node.node(), node.next);
        } else {
          node.parent.appendChild(node.node());
        }
      }

      this.attach(node);
    }
  }
}
