import { select } from 'd3';
import button from './form/button';
import input from './form/input';

export default function renderForm(item, format) {
  item
    .filter((datum) => typeof datum.icon !== 'undefined')
    .classed('icon', true)
    .append('span')
    .attr('class', (datum) => 'icon ' + datum.icon);

  item
    .append('label')
    .attr('for', (datum, index) => (datum.name || datum.type) + '-' + index)
    .style('width', (datum) => datum.width)
    .text((d, i, n) => format(d, i, n, 'l1'));

  item.each((datum, index, nodes) => {
    const node = select(nodes[index]);

    if (datum.type && input[datum.type]) {
      input[datum.type]
        .render(datum, index, node, (name) => {
          return format(datum, index, nodes, name);
        })
        .attr('id', (datum.name || datum.type) + '-' + index)
        .attr('name', () => {
          return datum.array ? datum.name + '[]' : datum.name;
        })
        .attr('tabindex', 0);
    }

    if (datum.button && button[datum.button]) {
      button[datum.button].create(datum, index, node);
    }
  });
}
