import { select } from 'd3';
import { Event } from '../event';

export class Input extends Event {
  constructor(options) {
    super(options);

    this
      .name('input')
      .throttle(500);
  }

  handle(box, data, snippet, event) {
    const node = select(event.srcElement);
    const minLength = node.attr('minlength');
    const value = node.property('value');

    if (typeof minLength !== 'undefined') {
      if (
        value.length >= minLength ||
        value.length === 0
      ) {
        box.input = value;
        this.pass(box, data);
      }
    } else {
      box.input = value;
      this.pass(box, data);
    }

    return false;
  }
}
