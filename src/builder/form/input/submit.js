import Input from './input';

export default class SubmitInput extends Input {
  create(item, field, data, format) {
    return item
      .append('input')
      .attr('type', 'submit')
      .attr('value', (d, i, n) => format(d, i, n, 'value'));
  }
}
