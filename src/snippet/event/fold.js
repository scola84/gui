import { select } from 'd3';
import Event from '../event';

export default class Fold extends Event {
  constructor(options = {}) {
    super(options);

    this._filter = null;
    this._storage = null;

    this.setFilter(options.filter);
    this.setStorage(options.storage);
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

  removeBefore() {
    this.unbind('click');
    this.removeOuter();
  }

  resolveAfter(box, data) {
    return this._list.map((snippet) => {
      this.load(box, data, snippet);
      this.fold(box, data, snippet);
      return snippet.node();
    });
  }

  resolveInner(box, data) {
    this.bind(box, data, 'click', (snippet, event) => {
      if (select(event.target).classed('fold handle') === true) {
        this.fold(box, data, snippet);
        this.save(box, data, snippet);
      }
    });

    return this.resolveAfter(box, data);
  }

  attach(node) {
    node.width = node.node().offsetWidth;

    node
      .classed('folded', false)
      .on('transitionend.scola', () => {
        node
          .style('height', null)
          .classed('transition', false)
          .on('transitionend.scola', null);
      });
  }

  detach(node) {
    const height = node.node().getBoundingClientRect().height;

    node
      .style('height', height)
      .classed('transition', true)
      .classed('folded', true)
      .on('transitionend.scola', () => {
        node.remove();
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
    const id = snippet.resolveAttribute(box, data, 'id');
    const key = `fold-${id}`;
    const folded = Boolean(Number(this._storage.getItem(key)));

    snippet.node().classed('folded', !folded);
  }

  save(box, data, snippet) {
    const id = snippet.resolveAttribute(box, data, 'id');
    const key = `fold-${id}`;
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
