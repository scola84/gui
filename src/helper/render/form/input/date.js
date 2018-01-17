export default class DateInput {
  render(datum, index, node, format) {
    const value = format('value');
    const number = Number.isInteger(value) ? value : null;

    const input = node
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'date')
      .property('valueAsNumber', number)
      .on('input', () => {
        this._setColor(input);
      });

    this._setColor(input);

    return input;
  }

  _setColor(input) {
    input.style('color', (d, i, n) => {
      return Number.isNaN(n[i].valueAsNumber) ? 'dimgrey' : null;
    });
  }
}
