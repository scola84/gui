import defaults from 'lodash-es/defaultsDeep';
import { Event } from '../event';

export class Scroll extends Event {
  constructor(options = {}) {
    super(options);

    this._height = null;
    this.setHeight(options.height);

    this
      .name('scroll')
      .throttle(250);
  }

  getHeight() {
    return this._height;
  }

  setHeight(value = 48) {
    this._height = value;
    return this;
  }

  height(value) {
    return this.setHeight(value);
  }

  resolveAfter(box, data) {
    const result = super.resolveAfter(box, data);

    for (let i = 0; i < result.length; i += 1) {
      result[i].dispatch('scroll');
    }

    return result;
  }

  resolveBefore(box, data) {
    defaults(box, {
      list: {
        count: 0,
        height: 0,
        offset: 0,
        total: 0
      }
    });

    return this.resolveOuter(box, data);
  }

  handle(box, data, snippet) {
    if (box.list.total % box.list.count > 0) {
      return false;
    }

    const initialized = box.list.height > 0;

    if (initialized === false) {
      box.list.height = parseInt(snippet.node().style('height'), 10);
      box.list.count = Math.round(box.list.height / this._height) * 2;
    }

    const node = snippet.node().node();
    const top = box.list.height + node.scrollTop;
    const threshold = node.scrollHeight - (box.list.height / 4 * 2);

    if (top > threshold) {
      if (initialized === true) {
        box.list.offset += box.list.count;
      }

      this.pass(box, data);
      return true;
    }

    return false;
  }
}
