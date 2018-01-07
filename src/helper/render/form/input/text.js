export default class TextInput {
  render(datum, index, node, format) {
    return node
      .append('input')
      .attr('placeholder', () => {
        return format({ name: 'form.placeholder' });
      })
      .attr('type', 'text')
      .attr('value', datum.value);
  }
}
