import { Input } from '../input';

export class Radio extends Input {
  constructor(options) {
    super(options);

    this.attributes({
      type: 'radio'
    });
  }
}
