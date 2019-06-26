import { select } from 'd3';
import Resizer from 'element-resize-detector';
import debounce from 'lodash-es/debounce';
import { Node } from '../node';

export class Panel extends Node {
  removeBefore(box, data) {
    const node = this._node.node();
    node.resizer.uninstall(node);

    this.removeOuter(box, data);
  }

  resolveAfter(box) {
    box.base.appendChild(this._node.node());

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
      .classed('transition', true)
      .classed('new', true)
      .classed(effect, true)
      .on('transitionend.scola-panel', () => {
        this._node
          .classed('transition', false)
          .on('transitionend.scola-panel', null);

        box.base.busy = false;
      });

    this._node.style('left');

    old.classed('in', false);
    this._node.classed('in', true);

    if (effect === 'none') {
      old.dispatch('transitionend');
      this._node.dispatch('transitionend');
    }

    box.base.snippet = this;

    return this.resolveResize();
  }

  resolveResize() {
    const resizer = Resizer({
      callOnAdd: false
    });

    const debouncer = debounce(() => {
      this._node.dispatch('resize');
    }, 100);

    resizer.listenTo(this._node.node(), () => {
      debouncer();
    });

    this._node.node().resizer = resizer;

    return this._node;
  }
}
