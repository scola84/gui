import { event, select } from 'd3';
import Input from './input';

export default class CheckboxInput extends Input {
  create(item, field, data) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('type', 'checkbox')
      .attr('value', this._value(field, data));

    item
      .append('label')
      .attr('for', field.name)
      .attr('tabindex', 0)
      .on('keydown', (datum, index, nodes) => {
        if (event.keyCode === 32) {
          const input = select(nodes[index].previousSibling);
          input.property('checked', !input.property('checked'));
        }
      });
  }
}
