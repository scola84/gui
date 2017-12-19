import Input from './input';

export default class IntegerInput extends Input {
  create(item, field, data, format) {
    return item
      .append('input')
      .attr('placeholder', (d, i, n) => format(d, i, n, 'placeholder'))
      .attr('type', 'number')
      .attr('value', this._value(field, data));
  }
}
