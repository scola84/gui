import Input from './input';

export default class SubmitInput extends Input {
  create(item, field, data, format) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .attr('value', (d, i, n) => format(d, i, n, 'value'));
  }
}
