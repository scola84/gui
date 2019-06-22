import { Event } from '../event';

export class Click extends Event {
  constructor(options) {
    super(options);
    this.name('click');
  }
}
