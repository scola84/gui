export default class ImgFigure {
  render(datum, index, node, format) {
    const src = format('img');

    if (src === null) {
      return null;
    }

    return node
      .append('img')
      .attr('src', src);
  }
}
