import { line } from 'd3';

export default function renderLine(route, values, keys, structure, plot) {
  const factory = line()
    .x((datum) => {
      const xScale = route.graph.axis[plot.x].axis.scale();
      return structure.axis[plot.x].value(datum, xScale);
    })
    .y((datum) => {
      const yScale = route.graph.axis[plot.y].axis.scale();
      return structure.axis[plot.y].value(datum, yScale);
    });

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
