import { select } from 'd3';
import { Node } from '../node';

export class Panel extends Node {
  resolveBefore(box, data) {
    const effect = ['rtl', 'ltr', 'ins']
      .find((name) => box.options[name] === true) || 'none';

    const old = box.base.snippet ? box.base.snippet.node()
      .classed('rtl ltr ins', false) : select();

    old
      .classed('old', true)
      .classed(effect, true)
      .on('transitionend.scola-panel', () => {
        old.on('.scola-panel', null);
        old.node().snippet.remove();
      });

    this._node
      .classed('new', true)
      .classed(effect, true)
      .on('transitionend.scola-panel', () => {
        this._node.on('.scola-panel', null);
        box.base.busy = false;
      });

    return this.resolveOuter(box, data);
  }

  resolveAfter(box) {
    const effect = ['rtl', 'ltr', 'ins']
      .find((name) => box.options[name] === true) || 'none';

    const old = box.base.snippet ? box.base.snippet.node() : select();
    const duration = parseFloat(this._node.style('transition-duration'));

    old.classed('in', false);
    this._node.classed('in', true);

    if (effect === 'none' || duration === 0) {
      old.dispatch('transitionend');
      this._node.dispatch('transitionend');
    }

    box.base.snippet = this;

    return this._node;
  }
}
