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

  validateAfter(box, data, error, name, value) {
    if (Number(value) !== parseFloat(value)) {
      return this.setError(error, name, value, 'type');
    }

    this.set(data, name, Number(value));

    return null;
  }
}
