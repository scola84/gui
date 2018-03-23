export default class FloatInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    return wrap
      .append('input')
      .attr('max', datum.range && datum.range[1])
      .attr('min', datum.range && datum.range[0])
      .attr('placeholder', format('placeholder'))
      .attr('step', datum.step)
      .attr('type', 'number')
      .attr('value', format('value'));
  }
}
