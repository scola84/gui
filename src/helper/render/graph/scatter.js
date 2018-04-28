export default function renderScatter(route, values, keys, structure) {
  values = keys === null ? [values] : values;

  const xScale = route.graph.bottom.scale();
  const yScale = route.graph.left.scale();

  const g = route.graph.g
    .append('g')
    .classed('scatter', true);

  let groups = g
    .selectAll('g')
    .data(values);

  groups = groups
    .enter()
    .append('g')
    .merge(groups);

  const circle = groups
    .selectAll('circle')
    .data((datum) => {
      return Object.values(datum);
    });

  const exit = circle
    .exit()
    .transition();

  exit.remove();

  const enter = circle
    .enter()
    .append('circle')
    .merge(circle);

  const minimize = enter.transition();

  const move = minimize
    .transition()
    .duration(0)
    .attr('cx', (datum) => {
      return structure.axis.bottom.value(datum, xScale);
    })
    .attr('cy', (datum) => {
      return structure.axis.left.value(datum, yScale);
    });

  move.transition().attr('r', 3);
}
