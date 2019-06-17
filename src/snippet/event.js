import { event } from 'd3';
import throttle from 'lodash-es/throttle';
import Action from './action';

export default class Event extends Action {
  constructor(options = {}) {
    super(options);

    this._name = null;
    this._throttle = null;

    this.setName(options.name);
    this.setThrottle(options.throttle);
  }

  getName() {
    return this._name;
  }

  setName(value = null) {
    this._name = value;
    return this;
  }

  getThrottle() {
    return this._throttle;
  }

  setThrottle(value = 0) {
    this._throttle = value;
    return this;
  }

  name(value) {
    return this.setName(value);
  }

  throttle(value) {
    return this.setThrottle(value);
  }

  removeBefore() {
    for (let i = 0; i < this._list.length; i += 1) {
      this.unbind(this._list[i]);
    }

    this.removeOuter();
  }

  resolveAfter() {
    const result = [];

    for (let i = 0; i < this._list.length; i += 1) {
      result[result.length] = this._list[i].node();
    }

    return result;
  }

  resolveInner(box, data) {
    for (let i = 0; i < this._list.length; i += 1) {
      this.bind(box, data, this._list[i]);
    }

    return this.resolveAfter(box, data);
  }

  bind(box, data, snippet) {
    const node = snippet.resolve(box, data);

    node.on(this._name, throttle(() => {
      let busy = this.isBusy(box);

      if (busy === false) {
        busy = this.handle(box, data, snippet, event);

        if (busy === false) {
          delete box.busy;
        }
      }
    }, this._throttle));
  }

  handle(box, data) {
    this.pass(box, data);
    return false;
  }

  isBusy(box) {
    if (box.busy === true) {
      return true;
    }

    box.busy = true;

    return false;
  }

  unbind(snippet) {
    snippet.node().on(this._name, null);
  }
}
