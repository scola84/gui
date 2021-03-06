import { select } from 'd3';
import button from './form/button';
import input from './form/input';
let id = 0;

export default function renderForm(item, format) {
  item
    .attr('class', (datum) => {
      return [datum.type, datum.name]
        .filter((v) => v)
        .join(' ');
    });

  item
    .append('span')
    .attr('class', 'number')
    .text((d, i, n) => format(d, i, n, 'number'));

  item
    .filter((datum, index, nodes) => {
      return select(nodes[index])
        .select('.number:not(:empty)')
        .size() > 0;
    })
    .classed('number', true);

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
    .append('div')
    .classed('l0', true)
    .text((d, i, n) => format(d, i, n, 'l0'));

  const line = primary
    .append('div')
    .classed('line', true);

  line
    .append('label')
    .classed('l1', true)
    .text((d, i, n) => {
      return d.text || format(d, i, n, 'l1');
    });

  line
    .append('div')
    .classed('l4', true)
    .text((d, i, n) => format(d, i, n, 'l4'));

  line
    .selectAll(':empty')
    .remove();

  primary
    .append('div')
    .classed('l2', true)
    .text((d, i, n) => format(d, i, n, 'l2'));

  primary
    .append('div')
    .classed('l3', true)
    .text((d, i, n) => format(d, i, n, 'l3'));

  primary
    .selectAll(':empty')
    .remove();

  const secondary = item
    .append('div')
    .classed('secondary', true);

  secondary
    .append('div')
    .classed('l5', true)
    .text((d, i, n) => format(d, i, n, 'l5'));

  item.each((datum, index, nodes) => {
    let result = null;
    let inputId = 'input-' + (++id);

    const inputName = datum.name ?
      datum.array ? datum.name + '[]' : datum.name :
      null;

    const types = Array.isArray(datum.type) ?
      datum.type : [datum.type];

    const node = select(nodes[index]);

    node
      .select('label')
      .attr('for', inputId);

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

      inputId = result.attr('id') || inputId;

      result
        .attr('id', inputId)
        .attr('name', inputName);

      if (result.attr('tabindex') !== '-1') {
        result.attr('tabindex', 0);
      }
    }

    if (datum.button && button[datum.button]) {
      button[datum.button].render(datum, index, node);
    }
  });
}
