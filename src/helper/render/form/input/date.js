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
      .classed('wrap date', true);

    const input = wrap
      .append('input')
      .attr('type', 'text');

    const label = wrap
      .append('label')
      .attr('for', id);

    wrap
      .append('span')
      .classed('clear ion-ios-close-circle', true)
      .on('click', () => {
        picker.clear();
      });

    picker = flatpickr(input.node(), {
      clickOpens: false,
      enableTime: datum.time,
      minuteIncrement: 1,
      position: 'below center',
      positionElement: label.node(),
      time_24hr: true,
      formatDate: () => {
        return input.property('value');
      },
      onChange: ([date]) => {
        this._formatDate(datum, label, format, date && date.valueOf());
      },
      onValueUpdate: ([date]) => {
        this._formatDate(datum, label, format, date && date.valueOf());
      }
    });

    select(label.node().previousSibling)
      .attr('id', id);

    label
      .on('mousedown', () => {
        event.stopPropagation();
      });

    input
      .on('mousedown', () => {
        event.stopPropagation();
      })
      .on('click', () => {
        const date = DateTime
          .fromMillis(Number(input.property('value')) || Date.now())
          .setZone('local')
          .startOf(datum.time ? 'second' : 'day');

        picker.setDate(date.valueOf());
        picker.toggle();
      });

    this._formatDate(datum, label, format, number);

    panel.on('remove.scola-gui-' + id, () => {
      panel.on('remove.scola-gui-' + id, null);
      picker.destroy();
    });

    return input;
  }

  _formatDate(datum, label, format, number) {
    const node = label.node();

    const date = DateTime
      .fromMillis(number || Date.now())
      .setZone('local')
      .startOf(datum.time ? 'second' : 'day');

    const value = date.valueOf();

    const text = number && date.toFormat(format('format')) ||
      format('placeholder') || 'mm/dd/yyyy';

    if (number) {
      if (node && node.previousSibling.type.slice(0, 4) === 'date') {
        node.previousSibling.valueAsNumber = value + (date.offset * 60 * 1000);
      } else {
        node.previousSibling.value = value;
      }
    }

    label
      .classed('placeholder', number ? false : true)
      .text(text);
  }
}
