import { select } from 'd3';
import { handleGrow } from '../../../';

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

    const panel = textarea
      .node()
      .closest('.panel');

    select(panel).on('resize.textarea', () => {
      this._grow(datum, textarea);
    });

    this._grow(datum, textarea);

    return textarea;
  }

  _grow(datum, textarea) {
    handleGrow(datum, textarea);
  }
}
