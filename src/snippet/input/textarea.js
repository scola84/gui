import Input from '../input';

export default class Textarea extends Input {
  constructor(options = {}) {
    super(options);
    this.setName('textarea');
  }

  cleanAfter(box, data, name, value) {
    this.set(data, name, String(value).trim());
  }
}
