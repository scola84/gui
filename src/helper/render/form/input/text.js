export default class TextInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    return wrap
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'text')
      .attr('value', format('value'));
  }
}
