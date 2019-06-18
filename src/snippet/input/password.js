import { Input } from '../input';

export class Password extends Input {
  constructor(options) {
    super(options);

    this.attributes({
      type: 'password'
    });
  }

  cleanAfter(box, data, name, value) {
    this.set(data, name, String(value));
  }
}
