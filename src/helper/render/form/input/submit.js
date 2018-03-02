export default class SubmitInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    return wrap
      .append('input')
      .attr('type', 'submit')
      .attr('value', format('value'));
  }
}
