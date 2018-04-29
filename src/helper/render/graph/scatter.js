import renderTip from './tip';

export default function renderScatter(route, values, keys, structure, plot) {
  values = keys === null ? [values] : values;

  const xScale = route.graph.axis.bottom.axis.scale();
  const yScale = route.graph.axis.left.axis.scale();

  const root = route.graph.root
    .append('g')
    .classed('plot scatter', true);

  let groups = root
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
    })
    .enter()
    .append('circle')
    .attr('cx', (datum) => {
      return structure.axis.bottom.value(datum, xScale);
    })
    .attr('cy', (datum) => {
      return structure.axis.left.value(datum, yScale);
    })
    .attr('r', 3);

  if (plot.tip) {
    circle.on('mouseover', (datum) => {
      renderTip(route, datum, plot);
    });

    circle.on('mouseout', () => {
      renderTip(route, null, plot);
    });
  }
}
