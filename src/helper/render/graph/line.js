import { line } from 'd3';

export default function renderLine(route, values, keys, structure, plot) {
  const xScale = route.graph.axis[plot.x].axis.scale();
  const yScale = route.graph.axis[plot.y].axis.scale();

  const factory = line()
    .x((datum) => structure.axis[plot.x].value(datum, xScale))
    .y((datum) => structure.axis[plot.y].value(datum, yScale));

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
