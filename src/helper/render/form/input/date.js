import { event, select } from 'd3';
import flatpickr from 'flatpickr';
import { DateTime } from 'luxon';

export default class DateInput {
  render(datum, index, node, format) {
    const panel = select(node.node().closest('.panel'));

    const value = format('value');
    const number = Number.isInteger(value) ? value : null;
    const id = 'input-' + datum.name + '-' + index;

    let picker = null;

    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    const input = wrap
      .append('input')
      .attr('id', id)
      .attr('type', 'text')
      .attr('value', number)
      .classed('date', true);

    const text = wrap
      .append('span')
      .classed('date value', true)
      .attr('for', id)
      .on('mousedown', () => {
        event.stopPropagation();
      })
      .on('click', () => {
        picker.toggle();
      });

    picker = flatpickr(input.node(), {
      defaultDate: number ? new Date(number) : null,
      enableTime: datum.time,
      time_24hr: true,
      formatDate: (date) => {
        return date.valueOf();
      },
      onChange: ([date]) => {
        this._setText(text, format, date.valueOf());
      }
    });

    this._setText(text, format, number);

    panel.on('remove.scola-gui-data', () => {
      panel.on('.scola-gui-data', null);
      picker.destroy();
    });

    return input;
  }

  _setText(text, format, number) {
    const date = number ? DateTime
      .fromMillis(number)
      .setZone('local')
      .toFormat(format('format')) : null;

    text
      .classed('placeholder', number ? false : true)
      .text(date || format('placeholder') || 'mm/dd/yyyy');
  }
}
