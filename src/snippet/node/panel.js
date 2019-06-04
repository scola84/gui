import { select } from 'd3';
import Resizer from 'element-resize-detector';
import debounce from 'lodash-es/debounce';
import Node from '../node';

let duration = 250;
let transition = true;

export default class Panel extends Node {
  static getDuration() {
    return duration;
  }

  static setDuration(value) {
    duration = value;
  }

  static getTransition() {
    return transition;
  }

  static setTransition(value) {
    transition = value;
  }

  resolveAfter(box) {
    const base = select(box.base);

    if (base.classed('busy') === true) {
      if (box.force !== true) {
        return;
      }
    }

    base.classed('busy', true);

    const dir = select('html').attr('dir') || 'ltr';
    const effect = this.createEffect(box);
    const width = parseFloat(base.style('width'));

    const {
      property,
      oldBegin,
      oldEnd,
      newBegin,
      newEnd
    } = this.calculate(effect, dir, width, box.factor);

    const old = base
      .select('.panel')
      .style(property, oldBegin)
      .transition()
      .duration(duration)
      .style(property, oldEnd)
      .on('end', () => {
        old.node().resizer.uninstall(old.node());
        old.node().snippet.remove();
      });

    this._node
      .style(property, newBegin)
      .transition()
      .duration(duration)
      .style(property, newEnd)
      .on('end', () => {
        this._node.style(property, null);
        base.classed('busy', false);
      });

    box.node = this._node.node();
    box.user = this._user;

    box.node.size = {};

    box.node.resizer = Resizer({
      callOnAdd: false
    });

    box.node.resizer.listenTo(box.node, debounce(() => {
      this.resize(box);
    }, 100));
  }

  calculate(effect, dir, width, factor) {
    if (effect === 'rtl' || effect === 'ltr') {
      return this.calculateMove(effect, dir, width, factor);
    }

    if (effect === 'fade') {
      return this.calculateFade();
    }

    return this.calculateNone();
  }

  calculateFade() {
    return {
      property: 'opacity',
      oldBegin: 1,
      oldEnd: 0,
      newBegin: 0,
      newEnd: 1
    };
  }

  calculateMove(effect, dir, width, factor = 0.25) {
    const move = effect === 'rtl' ? -1 : 1;
    const read = dir === 'rtl' ? -1 : 1;

    return {
      property: 'transform',
      oldBegin: 'translate(0, 0)',
      oldEnd: `translate(${move * read * factor * width}px, 0)`,
      newBegin: `translate(${-move * read * width}px, 0)`,
      newEnd: 'translate(0, 0)'
    };
  }

  calculateNone() {
    return {
      property: 'opacity',
      oldBegin: 1,
      oldEnd: 1,
      newBegin: 1,
      newEnd: 1
    };
  }

  createEffect(box) {
    if (transition === false) {
      return null;
    }

    if (box.rtl === true) {
      return 'rtl';
    }

    if (box.ltr === true) {
      return 'ltr';
    }

    if (box.fade !== false) {
      return 'fade';
    }

    return null;
  }

  resize(box) {
    const node = select(box.node);
    const body = node.select('.body').node();

    if (body === null) {
      return;
    }

    const height = body.getBoundingClientRect().height;
    const width = body.getBoundingClientRect().width;

    const changed =
      box.node.size.height !== height ||
      box.node.size.width !== width;

    box.node.size.height = height;
    box.node.size.width = width;

    node.dispatch('resize', {
      detail: changed
    });
  }
}
