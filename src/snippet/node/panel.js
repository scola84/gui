import { select } from 'd3';
import Resizer from 'element-resize-detector';
import debounce from 'lodash-es/debounce';
import { Node } from '../node';

const effects = ['rtl', 'ltr', 'fade'];

export class Panel extends Node {
  removeBefore(box, data) {
    const node = this._node.node();
    node.resizer.uninstall(node);

    this.removeOuter(box, data);
  }

  resolveAfter(box) {
    box.base.appendChild(this._node.node());

    const effect = effects
      .find((name) => box[name] === true) || 'none';

    const old = select(box.base)
      .select('.panel.new')
      .classed('rtl ltr fade', false);

    old
      .classed('transition old', true)
      .classed(effect, true)
      .on('transitionend.scola', () => {
        if (old.size() > 0) {
          old.node().snippet.remove();
        }
      });

    this._node
      .classed('transition new', true)
      .classed(effect, true)
      .on('transitionend.scola', () => {
        box.base.busy = false;
      });

    this._node.style('left');

    old.classed('in', false);
    this._node.classed('in', true);

    if (effect === 'none') {
      old.dispatch('transitionend');
      this._node.dispatch('transitionend');
    }

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
