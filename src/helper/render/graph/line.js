import { line } from 'd3';
import after from 'lodash-es/after';

export default function renderLine(graph, values, keys, structure, plot) {
  const plotEnter = plot.enter || ((selection, zoomed) => {
    return selection
      .duration(zoomed ? 0 : 250)
      .style('opacity', 1);
  });

  const plotExit = plot.exit || ((selection, zoomed) => {
    return selection
      .duration(zoomed ? 0 : 250)
      .style('opacity', 0);
  });

  const factory = line()
    .x((datum) => {
      const xScale = graph.axis[plot.x].axis.scale();
      return structure.axis[plot.x].value(datum, xScale);
    })
    .y((datum) => {
      const yScale = graph.axis[plot.y].axis.scale();
      return structure.axis[plot.y].value(datum, yScale);
    });

  const root = graph.root
    .append('g')
    .classed('plot line', true)
    .on('remove.scola-graph', () => {
      const path = root
        .selectAll('path');

      const exit = plotExit(path
        .transition(), graph.zoomed);

      const end = after(path.size(), () => {
        root.remove();
      });

      exit
        .remove()
        .on('end', end);
    });

  const path = root
    .selectAll('path')
    .data(values);

  const exit = plotExit(path
    .exit()
    .transition(), graph.zoomed);

  exit.remove();

  const enter = path
    .enter()
    .append('path')
    .merge(path);

  const minimize = plotExit(enter
    .transition(), graph.zoomed);

  const move = minimize
    .transition()
    .duration(0)
    .attr('d', (datum) => {
      return factory(Object.values(datum));
    });

  plotEnter(move
    .transition(), graph.zoomed);
}
