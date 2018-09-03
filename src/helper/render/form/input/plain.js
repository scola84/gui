export default class Plain {
  render(datum, index, node, format) {
    let text = format('value');

    if (typeof datum.value === 'function') {
      text = datum.value(datum);
    }

    text = typeof text === 'undefined' ||
      text === null ||
      text === '' ? '-' : text;

    node
      .select('.input')
      .append('div')
      .classed('plain', true)
      .text(text);
  }
}
