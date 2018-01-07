export default class EmailInput {
  render(datum, index, node, format) {
    return node
      .append('input')
      .attr('placeholder', () => {
        return format({ name: 'form.placeholder' });
      })
      .attr('type', 'email')
      .attr('value', datum.value);
  }
}
