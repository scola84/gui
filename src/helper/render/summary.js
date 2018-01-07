import { select } from 'd3';
import figure from './summary/figure';

export default function renderSummary(item, format) {
  item.each((datum, index, nodes) => {
    const node = select(nodes[index]);

    if (datum.field.type && figure[datum.field.type]) {
      const child = figure[datum.field.type]
        .render(datum, index, node, (context) => {
          return format(datum, index, nodes, context);
        });

      if (child === null) {
        node.remove();
      }
    }
  });
}
