import { Input } from '../input';

export class Textarea extends Input {
  constructor(options) {
    super(options);
    this.name('textarea');
  }

  cleanAfter(box, data, name, value) {
    this.setValue(data, name, String(value).trim());
  }
}
