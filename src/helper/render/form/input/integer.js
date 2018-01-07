export default class IntegerInput {
  render(datum, index, node, format) {
    return node
      .append('input')
      .attr('placeholder', () => {
        return format({ name: 'form.placeholder' });
      })
      .attr('type', 'number')
      .attr('value', datum.value);
  }
}
