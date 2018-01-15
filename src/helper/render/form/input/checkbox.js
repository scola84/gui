import { event } from 'd3';

export default class CheckboxInput {
  render(datum, index, node, format) {
    return datum.array === true ?
      this._renderBefore(datum, index, node, format) :
      this._renderAfter(datum, index, node, format);
  }

  _renderAfter(datum, index, node, format) {
    const input = node
      .append('input')
      .attr('type', 'checkbox')
      .attr('value', format('value'))
      .property('checked', format('checked'));

    node
      .append('label')
      .attr('for', datum.name + '-' + index)
      .attr('tabindex', 0)
      .on('keydown', () => {
        if (event.keyCode === 32) {
          this._changeChecked(input);
        }
      });

    return input;
  }

  _renderBefore(datum, index, node, format) {
    const input = node
      .classed('icon', true)
      .insert('input', 'label')
      .attr('type', 'checkbox')
      .attr('value', format('value'))
      .property('checked', format('checked'));

    node
      .insert('label', 'label')
      .attr('for', datum.name + '-' + index)
      .attr('tabindex', 0)
      .classed('icon', true)
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
    input.property('checked', !input.property('checked'));
  }
}
