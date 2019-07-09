import { event } from 'd3';
import throttle from 'lodash-es/throttle';
import { Action } from './action';

export class Event extends Action {
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
    for (let i = 0; i < this._args.length; i += 1) {
      this.unbind(this._args[i]);
    }

    this.removeOuter();
  }

  resolveAfter() {
    const result = [];

    for (let i = 0; i < this._args.length; i += 1) {
      result[result.length] = this._args[i].node();
    }

    return result;
  }

  resolveInner(box, data) {
    for (let i = 0; i < this._args.length; i += 1) {
      this.bind(box, data, this._args[i]);
    }

    return this.resolveAfter(box, data);
  }

  bind(box, data, snippet) {
    const node = this.resolveValue(box, data, snippet);

    if (node === null) {
      return;
    }

    const throttled = throttle((newEvent) => {
      this.handleBefore(box, data, snippet, newEvent);
    }, this._throttle);

    node.on(this._name, () => {
      throttled(event);
    });
  }

  handle(box, data) {
    this.pass(box, data);
    return false;
  }

  handleBefore(box, data, snippet, newEvent) {
    if (newEvent) {
      newEvent.preventDefault();
    }

    if (box.busy === true) {
      return;
    }

    box.busy = this.handle(box, data, snippet, newEvent);
  }

  unbind(snippet) {
    snippet.node().on(this._name, null);
  }
}
