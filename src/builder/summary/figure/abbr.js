export default class AbbrFigure {
  create(figure, data, format) {
    const text = format({ data, name: 'summary.abbr' });

    if (text === null) {
      return null;
    }

    return figure
      .append('abbr')
      .text(text);
  }
}
