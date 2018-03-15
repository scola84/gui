export default class FloatInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    return wrap
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'number')
      .attr('step', datum.step)
      .attr('value', format('value'));
  }
}
