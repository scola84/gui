export default class IntegerInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    return wrap
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'number')
      .attr('value', format('value'));
  }
}
