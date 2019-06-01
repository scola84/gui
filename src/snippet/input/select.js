import Input from '../input';

export default class Select extends Input {
  constructor(options = {}) {
    super(options);
    this.setName('select');
  }

  _validate(box, data, error) {
    const name = this._resolveValue(
      box,
      data,
      this._attributes,
      'name'
    );

    const values = [];
    const value = data[name];

    for (let i = 0; i < this._list.length; i += 1) {
      values[values.length] = this._resolveValue(
        box,
        data,
        this._list[i].getAttributes(),
        'value'
      );
    }

    for (let i = 0; i < values.length; i += 1) {
      if (values[i] === value) {
        return;
      }
    }

    error[name] = {
      type: 'select',
      values,
      value
    };
  }
}
