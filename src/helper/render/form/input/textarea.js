export default class TextareaInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .classed('textarea', true)
      .append('div')
      .classed('wrap', true);

    const textarea = wrap
      .append('textarea')
      .attr('placeholder', format('placeholder'))
      .text(format('value'))
      .on('input', () => {
        this._grow(datum, textarea);
      });

    this._grow(datum, textarea);

    return textarea;
  }

  _grow(datum, textarea) {
    textarea.style('height', 0);
    const height = Math.max(datum.height || 0, textarea.node().scrollHeight);
    textarea.style('height', height + 'px');
  }
}
