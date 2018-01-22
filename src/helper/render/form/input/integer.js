export default class IntegerInput {
  render(datum, index, node, format) {
    return node
      .select('.input')
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'number')
      .attr('value', format('value'));
  }
}
