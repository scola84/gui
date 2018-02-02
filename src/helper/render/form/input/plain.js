export default class Plain {
  render(datum, index, node, format) {
    node
      .select('.input')
      .append('div')
      .classed('plain', true)
      .text(format('value') || '-');
  }
}
