export default class PasswordInput {
  render(datum, index, node, format) {
    return node
      .append('input')
      .attr('placeholder', () => {
        return format({ name: 'form.placeholder' });
      })
      .attr('type', 'password');
  }
}
