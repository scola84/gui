import { line } from 'd3';

export default function renderLine(route, values, keys, structure) {
  values = keys === null ? [values] : values;

  const xScale = route.graph.bottom.scale();
  const yScale = route.graph.left.scale();

  const factory = line()
    .x((datum) => structure.axis.bottom.value(datum, xScale))
    .y((datum) => structure.axis.left.value(datum, yScale));

  const g = route.graph.g
    .append('g')
    .classed('line', true);

  const path = g
    .selectAll('path')
    .data(values);

  const exit = path
    .exit()
    .transition();

  exit.remove();

  const enter = path
    .enter()
    .append('path')
    .merge(path);

  const minimize = enter.transition();

  const move = minimize
    .transition()
    .duration(0)
    .attr('d', (datum) => {
      return factory(Object.values(datum));
    });

  move.transition();
}
