import { select } from 'd3';
import { Event } from '../event';

export class Click extends Event {
  constructor(options) {
    super(options);
    this.name('click');
  }

  handle(box, data) {
    if (select(event.target).classed('click') === true) {
      this.pass(box, data);
    }

    return false;
  }
}
