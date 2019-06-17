import Event from '../event';

export default class Click extends Event {
  constructor(options) {
    super(options);
    this.name('click');
  }
}
