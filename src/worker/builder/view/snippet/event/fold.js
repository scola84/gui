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

    for (let i = 0; i < this._args.length; i += 1) {
      snippet = this._args[i];

      this.load(box, data, snippet);
      this.fold(box, data, snippet);

      result[result.length] = snippet.node();
    }

    return result;
  }

  handle(box, data, snippet, event) {
    const handle = select(event.target);
    const mustFold = handle.classed('fold handle');

    if (mustFold === true) {
      this.fold(box, data, snippet);
      this.save(box, data, snippet);
    }

    return false;
  }

  attach(item, immediate) {
    item.style('width');

    item
      .classed('out', false)
      .classed('immediate', immediate)
      .on('transitionend.scola-fold', () => {
        item
          .style('height', null)
          .on('.scola-fold', null);
      });

    const duration = parseFloat(item.style('transition-duration'));

    if (duration === 0) {
      item.dispatch('transitionend');
    }
  }

  detach(item, immediate) {
    const height = item.node().getBoundingClientRect().height;

    item.style('height', height);
    item.style('width');

    item
      .classed('out', true)
      .classed('immediate', immediate)
      .on('transitionend.scola-fold', () => {
        item
          .on('transitionend.scola-fold', null)
          .remove();
      });

    const duration = parseFloat(item.style('transition-duration'));

    if (height === 0 || duration === 0) {
      item.dispatch('transitionend');
    }
  }

  fold(box, data, snippet) {
    const group = snippet.node();
    const isFolded = group.classed('folded');
    const immediate = group.classed('immediate');
    const snippets = this._filter(snippet);

    group.classed('folded', !isFolded);
    group.classed('immediate', false);

    if (isFolded) {
      this.show(snippets, immediate);
    } else {
      this.hide(snippets, immediate);
    }
  }

  hide(snippets, immediate) {
    let item = null;

    for (let i = 0; i < snippets.length; i += 1) {
      item = snippets[i].node();

      item.next = item.node().nextSibling;
      item.parent = item.node().parentNode;

      this.detach(item, immediate);
    }
  }

  load(box, data, snippet) {
    const isFolded = Boolean(
      Number(
        this._storage.getItem(`fold-${this._id}`)
      )
    );

    snippet
      .node()
      .classed('immediate', true)
      .classed('folded', !isFolded);
  }

  save(box, data, snippet) {
    const isFolded = snippet
      .node()
      .classed('folded');

    this._storage.setItem(
      `fold-${this._id}`,
      Number(isFolded)
    );
  }

  show(snippets, immediate) {
    let item = null;

    for (let i = snippets.length - 1; i >= 0; i -= 1) {
      item = snippets[i].node();

      if (item.parent) {
        if (item.next) {
          item.parent.insertBefore(item.node(), item.next);
        } else {
          item.parent.appendChild(item.node());
        }
      }

      this.attach(item, immediate);
    }
  }
}
