import Input from '../input';
const regexp = /^#[A-F0-9]{6}$/;

export default class Color extends Input {
  constructor(options = {}) {
    super(options);

    this
      .setAttributes({
        type: 'color'
      })
      .setName('input');
  }

  cleanAfter(box, data, name, value) {
    this.set(data, name, String(value).trim().toUpperCase());
  }

  validateBefore(box, data, error, name, value) {
    if (regexp.test(value) === false) {
      this.throwError(value, 'type');
    }
  }
}
