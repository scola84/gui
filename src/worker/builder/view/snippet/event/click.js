import { Event } from '../event';

export class Click extends Event {
  constructor(options) {
    super(options);
    this.name('click');
  }

  handle(box, data) {
    if (event.target.closest('.click') !== null) {
      this.pass(box, data);
    }

    return false;
  }
}
