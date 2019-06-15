import Input from '../input';

export default class Select extends Input {
  constructor(options) {
    super(options);
    this.setName('select');
  }

  validateAfter(box, data, error, name, value) {
    const values = [];

    for (let i = 0; i < this._list.length; i += 1) {
      values[values.length] = this._list[i].resolveAttribute(
        box,
        data,
        'value'
      );
    }

    for (let i = 0; i < values.length; i += 1) {
      if (values[i] === value) {
        return null;
      }
    }

    return this.setError(error, name, value, 'type', { values });
  }
}
