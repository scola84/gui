import { select } from 'd3';

export default class SubmitInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    const input = wrap
      .append('input')
      .attr('type', 'submit')
      .attr('value', format('value'))
      .on('click', () => {
        this._changeLink(datum, input);
      });

    return input;
  }

  _changeLink(datum, input) {
    if (!datum.link) {
      return;
    }

    const link = select(input.node().form)
      .select(`*[name=${datum.link}]`);

    link.property('value', datum.name);
  }
}
