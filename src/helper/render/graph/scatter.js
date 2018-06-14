import after from 'lodash-es/after';
import renderTip from './tip';

export default function renderScatter(graph, values, keys, structure, plot, format) {
  const plotEnter = plot.enter || ((selection, zoomed) => {
    return selection
      .duration(zoomed ? 0 : 250)
      .attr('r', 3);
  });

  const plotExit = plot.exit || ((selection, zoomed) => {
    return selection
      .duration(zoomed ? 0 : 250)
      .attr('r', 0);
  });

  const root = graph.root
    .append('g')
    .classed('plot scatter', true)
    .on('remove.scola-graph', () => {
      const circle = root
        .selectAll('circle');

      const exit = plotExit(circle
        .transition(), graph.zoomed);

      const end = after(circle.size(), () => {
        root.remove();
      });

      exit
        .remove()
        .on('end', end);
    });

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
    });

  const exit = plotExit(circle
    .exit()
    .transition(), graph.zoomed);

  exit.remove();

  const enter = circle
    .enter()
    .append('circle')
    .merge(circle);

  const minimize = plotExit(enter
    .transition(), graph.zoomed);

  const move = minimize
    .transition()
    .duration(0)
    .attr('cx', (datum) => {
      const xScale = graph.axis[plot.x].axis.scale();
      return structure.axis[plot.x].value(datum, xScale);
    })
    .attr('cy', (datum) => {
      const yScale = graph.axis[plot.y].axis.scale();
      return structure.axis[plot.y].value(datum, yScale);
    });

  plotEnter(move
    .transition(), graph.zoomed);

  if (plot.tip) {
    enter.on('mouseover', (datum) => {
      renderTip(graph, datum, plot, format);
    });

    enter.on('mouseout', () => {
      renderTip(graph, null, plot, format);
    });

    renderTip(graph, null, plot, format);
  }

  if (plot.click) {
    enter.on('click', (datum) => {
      if (enter.style('cursor') === 'pointer') {
        renderTip(graph, null, plot, format);
        plot.click(graph, datum, structure);
      }
    });
  }
}
