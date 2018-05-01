import renderTip from './tip';

export default function renderScatter(route, values, keys, structure, plot, format) {
  const xScale = route.graph.axis[plot.x].axis.scale();
  const yScale = route.graph.axis[plot.y].axis.scale();

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
      return structure.axis[plot.x].value(datum, xScale);
    })
    .attr('cy', (datum) => {
      return structure.axis[plot.y].value(datum, yScale);
    })
    .attr('r', 3);

  if (plot.tip) {
    circle.on('mouseover', (datum) => {
      renderTip(route, datum, plot, format);
    });

    circle.on('mouseout', () => {
      renderTip(route, null, plot, format);
    });
  }
}
