export default class TelInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    return wrap
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'tel')
      .attr('value', format('value'));
  }
}
