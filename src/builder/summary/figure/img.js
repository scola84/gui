export default class ImgFigure {
  create(figure, data, format) {
    const src = format({ data, name: 'summary.img' });

    if (src === null) {
      return null;
    }

    return figure
      .append('img')
      .attr('src', src);
  }
}
