export default class RadioInput {
  render(datum, index, node, format) {
    const container = node
      .select('.input')
      .append('div')
      .classed('radio', true);

    const input = container
      .append('input')
      .attr('type', 'radio')
      .attr('value', format('value'))
      .property('checked', format('checked'));

    container
      .append('label');

    node
      .classed('click', true)
      .select('label')
      .attr('tabindex', 0)
      .on('keydown', () => {
        if (event.keyCode === 32) {
          this._changeChecked(input);
        }
      });

    node.on('click', () => {
      this._changeChecked(input);
    });

    return input;
  }

  _changeChecked(input) {
    input.property('checked', 'checked');
  }
}
