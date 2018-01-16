export default class AbbrFigure {
  render(datum, index, node, format) {
    const text = format('abbr');

    if (text === null) {
      return null;
    }

    return node
      .append('abbr')
      .text(text.slice(0, datum.length));
  }
}
