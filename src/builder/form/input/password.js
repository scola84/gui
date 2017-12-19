import Input from './input';

export default class PasswordInput extends Input {
  create(item, field, data, format) {
    return item
      .append('input')
      .attr('placeholder', (d, i, n) => format(d, i, n, 'placeholder'))
      .attr('type', 'password');
  }
}
