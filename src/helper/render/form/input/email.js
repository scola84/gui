export default class EmailInput {
  render(datum, index, node, format) {
    return node
      .select('.input')
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'email')
      .attr('value', format('value'));
  }
}
