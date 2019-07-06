import { select } from 'd3';
import { Node } from '../node';

export class Panel extends Node {
  resolveAfter(box) {
    const effect = ['rtl', 'ltr', 'ins']
      .find((name) => box.options[name] === true) || 'none';

    const old = box.base.snippet ? box.base.snippet.node()
      .classed('rtl ltr ins', false) : select();

    old
      .classed('transition', true)
      .classed('old', true)
      .classed(effect, true)
      .on('transitionend.scola-panel', () => {
        old
          .classed('transition', false)
          .on('transitionend.scola-panel', null);

        old.node().snippet.remove();
      });

    this._node
      .classed('new', true)
      .classed(effect, true);

    this._node.style('width');

    this._node
      .classed('transition', true)
      .on('transitionend.scola-panel', () => {
        this._node
          .classed('transition', false)
          .on('transitionend.scola-panel', null);

        box.base.busy = false;
      });

    old.classed('in', false);
    this._node.classed('in', true);

    if (effect === 'none') {
      old.dispatch('transitionend');
      this._node.dispatch('transitionend');
    }

    box.base.snippet = this;

    return this._node;
  }
}
