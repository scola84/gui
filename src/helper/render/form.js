import { select } from 'd3';
import button from './form/button';
import input from './form/input';
let id = 0;

export default function renderForm(item, format) {
  item
    .append('span')
    .attr('class', 'number')
    .text((d, i, n) => format(d, i, n, 'number'));

  item
    .filter((datum) => typeof datum.icon !== 'undefined')
    .classed('icon', true)
    .append('span')
    .attr('class', (datum) => 'icon ' + datum.icon);

  const container = item
    .append('div')
    .classed('input', true);

  const primary = container
    .append('div')
    .classed('primary', true)
    .style('width', (datum) => datum.width);

  primary
    .append('span')
    .classed('l0', true)
    .text((d, i, n) => format(d, i, n, 'l0'));

  primary
    .append('label')
    .classed('l1', true)
    .text((d, i, n) => format(d, i, n, 'l1'));

  primary
    .append('span')
    .classed('l2', true)
    .text((d, i, n) => format(d, i, n, 'l2'));

  primary
    .append('span')
    .classed('l3', true)
    .text((d, i, n) => format(d, i, n, 'l3'));

  primary
    .selectAll(':empty')
    .remove();

  item.each((datum, index, nodes) => {
    const inputId = 'input-' + (++id);
    const inputName = datum.name ?
      datum.array ? datum.name + '[]' : datum.name :
      null;

    const node = select(nodes[index]);

    node
      .select('label')
      .attr('for', inputId);

    const types = Array.isArray(datum.type) ?
      datum.type : [datum.type];

    let result = null;

    for (let i = 0; i < types.length; i += 1) {
      if (!input[types[i]]) {
        continue;
      }

      result = input[types[i]].render(datum, index, node, (name) => {
        return format(datum, index, nodes, name);
      });

      if (!result) {
        continue;
      }

      result
        .attr('id', inputId)
        .attr('name', inputName)
        .attr('tabindex', 0);
    }

    if (datum.button && button[datum.button]) {
      button[datum.button].render(datum, index, node);
    }
  });
}
