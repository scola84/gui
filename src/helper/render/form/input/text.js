export default class TextInput {
  render(datum, index, node, format) {
    return node
      .select('.input')
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'text')
      .attr('value', format('value'));
  }
}
