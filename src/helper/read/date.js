import { select } from 'd3';
import { DateTime } from 'luxon';

export default function readDate(route, data, form) {
  form
    .selectAll('.input .date')
    .each((datum, index, nodes) => {
      const node = select(nodes[index]);
      const dateInput = node.select('input[type=date]').node();
      const textInput = node.select('input[name]').node();

      const value = dateInput ?
        dateInput.valueAsNumber : textInput.value;

      if (value) {
        const date = DateTime
          .fromMillis(Number(value))
          .setZone('local');

        data[textInput.name] = dateInput ?
          date.valueOf() - (date.offset * 60 * 1000) :
          date.valueOf();
      }
    });

  return data;
}
