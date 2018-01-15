import { select } from 'd3';
import figure from './summary/figure';

export default function renderSummary(item, format) {
  item.each((datum, index, nodes) => {
    const node = select(nodes[index]);

    if (datum.type && figure[datum.type]) {
      const child = figure[datum.type]
        .render(datum, index, node, (name) => {
          return format(datum, index, nodes, name);
        });

      if (child === null) {
        node.remove();
      }
    }
  });
}
