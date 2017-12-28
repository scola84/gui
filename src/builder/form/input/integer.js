import Input from './input';

export default class IntegerInput extends Input {
  create(item, field, data, format) {
    return item
      .append('input')
      .attr('placeholder', (d, i, n) => {
        return format(d, i, n, { name: 'form.placeholder' });
      })
      .attr('type', 'number')
      .attr('value', this._value(field, data));
  }
}
