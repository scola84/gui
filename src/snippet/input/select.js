import Input from '../input';

export default class Select extends Input {
  constructor(options = {}) {
    super(options);
    this.setName('select');
  }

  _validate(box, data, result) {
    const attributes = this._resolve(this._attributes, box, data);
    const name = attributes.name;

    const values = [];

    for (let i = 0; i < this._list.length; i += 1) {
      values[values.length] = this._list[i].getAttributes().value;
    }

    let found = false;

    for (let i = 0; i < values.length; i += 1) {
      found = values[i] === data[name];

      if (found === true) {
        break;
      }
    }

    if (found === true) {
      result[name] = data[name];
      return;
    }

    result[name] = new Error();
    result[name].details = {
      type: 'select',
      values
    };
  }
}
