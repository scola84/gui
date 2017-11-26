import { event, select } from 'd3';

export default class CheckboxInput {
  create(item, field, data) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('type', 'checkbox')
      .attr('value', data[field.name]);

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
