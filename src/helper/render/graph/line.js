import { line } from 'd3';

export default function renderLine(route, values, keys, structure) {
  values = keys === null ? [values] : values;

  const xScale = route.graph.axis.bottom.axis.scale();
  const yScale = route.graph.axis.left.axis.scale();

  const factory = line()
    .x((datum) => structure.axis.bottom.value(datum, xScale))
    .y((datum) => structure.axis.left.value(datum, yScale));

  const root = route.graph.root
    .append('g')
    .classed('plot line', true);

  root
    .selectAll('path')
    .data(values)
    .enter()
    .append('path')
    .attr('d', (datum) => {
      return factory(Object.values(datum));
    });
}
