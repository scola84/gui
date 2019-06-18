import { DateTime } from './datetime';

export class Month extends DateTime {
  constructor(options) {
    super(options);

    this
      .attributes({
        type: 'month'
      })
      .format('yyyy-MM');
  }
}
