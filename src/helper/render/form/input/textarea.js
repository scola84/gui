import { select } from 'd3';

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
    textarea.style('height', 0);

    const node = textarea.node();
    const content = node.closest('.content');

    let currentHeight = 0;

    select(content).selectAll('form').each((d, i, n) => {
      currentHeight += n[i].getBoundingClientRect().height;
    });

    const contentRect = content.getBoundingClientRect();
    const maxHeight = contentRect.height - currentHeight - 16;

    const height = Math.max(datum.height || 32,
      Math.min(maxHeight, node.scrollHeight));

    textarea.style('height', height + 'px');
  }
}
