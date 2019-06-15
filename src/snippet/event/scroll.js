import Event from '../event';

export default class Scroll extends Event {
  constructor(options = {}) {
    super(options);

    this._height = null;
    this.setHeight(options.height);
  }

  setName(value = 'scroll') {
    return super.setName(value);
  }

  setThrottle(value = 250) {
    return super.setThrottle(value);
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
      this.initialize(box, data, result[i]);
    }

    return result;
  }

  handle(box, data, snippet, event) {
    if (box.scroll.total % box.scroll.count > 0) {
      return;
    }

    if (box.scroll.busy === true) {
      return;
    }

    const node = snippet.node().node();
    const top = box.scroll.height + node.scrollTop;
    const threshold = node.scrollHeight - (box.scroll.height / 4 * 2);
    const initialize = event && event.detail && event.detail.initialize;

    if (top > threshold) {
      box.scroll.busy = true;

      if (initialize !== true) {
        box.scroll.offset += box.scroll.count;
      }

      this.pass(box, data);
    }
  }

  initialize(box, data, node) {
    const height = parseInt(node.style('height'), 10) || 768;

    box.scroll = {
      busy: false,
      count: Math.round(height / this._height) * 2,
      height,
      offset: 0,
      total: 0
    };

    node.dispatch('scroll', { detail: { initialize: true } });
  }
}
