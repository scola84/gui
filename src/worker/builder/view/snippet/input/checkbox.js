import { Input } from '../input';

export class Checkbox extends Input {
  constructor(options) {
    super(options);

    this.attributes({
      type: 'checkbox'
    });
  }
}
