import Input from '../input';

export default class Text extends Input {
  constructor(options) {
    super(options);

    this
      .setAttributes({
        type: 'text'
      })
      .setName('input');
  }

  cleanAfter(box, data, name, value) {
    this.set(data, name, String(value).trim());
  }
}
