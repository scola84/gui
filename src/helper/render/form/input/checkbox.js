import { event } from 'd3';

export default class CheckboxInput {
  render(datum, index, node) {
    return datum.field.array === true ?
      this._renderBefore(datum, index, node) :
      this._renderAfter(datum, index, node);
  }

  _renderAfter(datum, index, node) {
    const input = node
      .append('input')
      .attr('type', 'checkbox')
      .attr('value', datum.value);

    node
      .append('label')
      .attr('for', datum.field.name + '-' + index)
      .attr('tabindex', 0)
      .on('keydown', () => {
        if (event.keyCode === 32) {
          this._changeChecked(input);
        }
      });

    return input;
  }

  _renderBefore(datum, index, node) {
    const input = node
      .classed('icon', true)
      .insert('input', 'label')
      .attr('type', 'checkbox')
      .attr('value', datum.value);

    node
      .insert('label', 'label')
      .attr('for', datum.field.name + '-' + index)
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
