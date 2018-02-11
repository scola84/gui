export default class EmailInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    return wrap
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'email')
      .attr('value', format('value'));
  }
}
