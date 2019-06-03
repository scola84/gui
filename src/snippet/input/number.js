import Input from '../input';

export default class Num extends Input {
  constructor(options = {}) {
    super(options);

    this
      .setAttributes({
        type: 'number'
      })
      .setName('input');
  }

  validateBefore(box, data, error, name, value) {
    if (Number(value) !== parseFloat(value)) {
      this.throwError(value, 'type');
    }

    this.set(data, name, Number(value));
  }
}
