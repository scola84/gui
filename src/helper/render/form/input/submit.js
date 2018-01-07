export default class SubmitInput {
  render(datum, index, node, format) {
    return node
      .append('input')
      .attr('type', 'submit')
      .attr('value', () => {
        return format({ name: 'form.value' });
      });
  }
}
