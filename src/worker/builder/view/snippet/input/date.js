import { DateTime } from './datetime';

export class Date extends DateTime {
  constructor(options) {
    super(options);

    this
      .attributes({
        type: 'date'
      })
      .format('yyyy-MM-dd');
  }
}
