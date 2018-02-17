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
        this._grow(textarea);
      });

    this._grow(textarea);

    return textarea;
  }

  _grow(textarea) {
    textarea.style('height', 0);
    textarea.style('height', textarea.node().scrollHeight + 'px');
  }
}
