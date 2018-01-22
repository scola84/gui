import { event } from 'd3';

export default class CheckboxInput {
  render(datum, index, node, format) {
    return datum.array === true ?
      this._renderBefore(datum, index, node, format) :
      this._renderAfter(datum, index, node, format);
  }

  _renderAfter(datum, index, node, format) {
    const container = node
      .select('.input')
      .append('div')
      .classed('checkbox', true);

    const input = container
      .append('input')
      .attr('type', 'checkbox')
      .attr('value', format('value'))
      .property('checked', format('checked'));

    container
      .append('label')
      .attr('tabindex', 0)
      .attr('for', node.select('label').attr('for'))
      .on('keydown', () => {
        if (event.keyCode === 32) {
          this._changeChecked(input);
        }
      });

    return input;
  }

  _renderBefore(datum, index, node, format) {
    const item = node
      .classed('click icon', true)
      .select('.input');

    const container = item
      .insert('div', '.primary')
      .classed('checkbox', true);

    const input = container
      .append('input')
      .attr('type', 'checkbox')
      .attr('value', format('value'))
      .property('checked', format('checked'));

    container
      .append('label')
      .attr('tabindex', 0)
      .classed('icon', true)
      .on('keydown', () => {
        if (event.keyCode === 32) {
          this._changeChecked(input);
        }
      });

    item.on('click', () => {
      this._changeChecked(input);
    });

    return input;
  }

  _changeChecked(input) {
    input.property('checked', !input.property('checked'));
  }
}
