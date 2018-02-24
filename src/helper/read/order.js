import { select } from 'd3';

export default function readOrder(form, data) {
  form
    .selectAll('ul.order.read')
    .each((d, group, nodes) => {
      select(nodes[group])
        .selectAll('li')
        .each((datum, index) => {
          const id = datum.empty ? 0 : datum[datum.name];
          data[datum.name] = data[datum.name] || [];
          data[datum.name].push(id + '-' + (group + 1) + '-' + (index + 1));
        });
    });

  return data;
}
