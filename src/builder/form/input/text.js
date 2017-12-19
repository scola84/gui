import Input from './input';

export default class TextInput extends Input {
  create(item, field, data, format) {
    return item
      .append('input')
      .attr('placeholder', (d, i, n) => format(d, i, n, 'placeholder'))
      .attr('type', 'text')
      .attr('value', this._value(field, data));
  }
}
