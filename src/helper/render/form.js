import { select } from 'd3';
import button from './form/button';
import input from './form/input';

export default function renderForm(item, format) {
  item
    .filter((datum) => typeof datum.field.icon !== 'undefined')
    .classed('icon', true)
    .append('span')
    .attr('class', (datum) => 'icon ' + datum.field.icon);

  item
    .append('label')
    .attr('for', (datum, index) => datum.field.name + '-' + index)
    .text((d, i, n) => format(d, i, n, { name: 'form.label' }));

  item.each((datum, index, nodes) => {
    const node = select(nodes[index]);

    if (datum.field.type && input[datum.field.type]) {
      input[datum.field.type]
        .render(datum, index, node, (context) => {
          return format(datum, index, nodes, context);
        })
        .attr('id', datum.field.name + '-' + index)
        .attr('name', () => {
          return datum.field.array ?
            datum.field.name + '[]' : datum.field.name;
        })
        .attr('tabindex', 0);
    }

    if (datum.field.button && button[datum.field.button]) {
      button[datum.field.button].create(datum, index, node);
    }
  });
}
