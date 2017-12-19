import { event } from 'd3';
import Input from './input';

export default class CheckboxInput extends Input {
  create(item, field, data) {
    const input = item
      .append('input')
      .attr('type', 'checkbox')
      .attr('value', this._value(field, data));

    item
      .append('label')
      .attr('for', field.name)
      .attr('tabindex', 0)
      .on('keydown', () => {
        if (event.keyCode === 32) {
          input.property('checked', !input.property('checked'));
        }
      });

    return input;
  }
}
