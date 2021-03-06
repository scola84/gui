import { event, select } from 'd3';
import Long from 'long';

export default class CheckboxInput {
  render(datum, index, node, format) {
    return datum.array === true ?
      this._renderBefore(datum, index, node, format) :
      this._renderAfter(datum, index, node, format);
  }

  _changeChecked(datum, input) {
    input.property('checked', !input.property('checked'));
    this._changeLinkBit(datum, input);
  }

  _changeLinkBit(datum, input) {
    if (!datum.link || !datum.bit) {
      return;
    }

    const checked = input.property('checked');
    const link = select(input.node().form)
      .select(`input[name=${datum.link}]`);

    const value = Long.fromNumber(Number(link.attr('value')));
    const bit = Long.fromNumber(datum.bit);

    link.attr('value', checked ? value.or(bit) : value.xor(bit));
  }

  _renderAfter(datum, index, node, format) {
    const container = node
      .select('.input')
      .append('div')
      .classed('checkbox', true);

    const input = container
      .append('input')
      .attr('type', 'checkbox')
      .on('change', () => {
        this._changeLinkBit(datum, input);
      });

    container
      .append('label')
      .attr('tabindex', 0)
      .attr('for', node.select('label').attr('for'))
      .on('keydown', () => {
        if (event.keyCode === 32) {
          this._changeChecked(datum, input);
        }
      });

    this._renderValue(datum, input, format);

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
      .on('change', () => {
        this._changeLinkBit(datum, input);
      });

    container
      .append('label')
      .attr('tabindex', 0)
      .classed('icon', true)
      .on('keydown', () => {
        if (event.keyCode === 32) {
          this._changeChecked(datum, input);
        }
      });

    node.on('click', () => {
      this._changeChecked(datum, input);
    });

    this._renderValue(datum, input, format);

    return input;
  }

  _renderValue(datum, input, format) {
    if (datum.bit) {
      this._renderValueBit(datum, input, format);
    } else {
      this._renderValueNormal(datum, input, format);
    }
  }

  _renderValueBit(datum, input, format) {
    const value = Long.fromNumber(Number(format('value')));
    const bit = Long.fromNumber(datum.bit);

    input
      .attr('value', 1)
      .property('checked', value.and(bit).toNumber());
  }

  _renderValueNormal(datum, input, format) {
    const value = format('value');

    input
      .attr('value', value)
      .property('checked', format('checked'));
  }
}
