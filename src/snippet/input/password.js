import Input from '../input';

export default class Password extends Input {
  constructor(options) {
    super(options);

    this
      .setAttributes({
        type: 'password'
      })
      .setName('input');
  }

  cleanAfter(box, data, name, value) {
    this.set(data, name, String(value));
  }
}
