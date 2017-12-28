import Input from './input';

export default class PasswordInput extends Input {
  create(item, field, data, format) {
    return item
      .append('input')
      .attr('placeholder', (d, i, n) => {
        return format(d, i, n, { name: 'form.placeholder' });
      })
      .attr('type', 'password');
  }
}
