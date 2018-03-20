export default class DateInput {
  render(datum, index, node, format) {
    const value = format('value');
    const number = Number.isInteger(value) ? value : null;

    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    const input = wrap
      .append('input')
      .attr('placeholder', format('placeholder') || 'mm/dd/yyyy')
      .attr('type', 'date');

    input
      .node()
      .format = format('format') || 'LL/dd/yyyy';

    input
      .property('valueAsNumber', number)
      .on('input', () => {
        this._setColor(input);
      });

    this._setColor(input);

    return input;
  }

  _setColor(input) {
    input.style('color', (d, i, n) => {
      return Number.isNaN(n[i].valueAsNumber) ? 'darkgrey' : null;
    });
  }
}
