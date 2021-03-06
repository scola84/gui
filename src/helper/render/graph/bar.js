import after from 'lodash-es/after';
import renderTip from './tip';

export default function renderBar(graph, values, keys, structure, plot, format) {
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

  const groupScale = structure.axis[plot.x].group();

  const xScale = graph.axis[plot.x].axis.scale();
  const xValue = (datum) => structure.axis[plot.x].value(datum, xScale);

  const yScale = graph.axis[plot.y].axis.scale();
  const yValue = (datum) => structure.axis[plot.y].value(datum, yScale);

  const root = graph.root
    .append('g')
    .classed('plot bar', true)
    .on('remove.scola-graph', () => {
      const rect = root
        .selectAll('rect');

      const exit = plotExit(rect
        .transition(), graph.zoomed);

      const end = after(rect.size(), () => {
        root.remove();
      });

      exit
        .remove()
        .on('end', end);
    });

  const isGrouped = keys !== null;

  const groups = isGrouped === true ?
    grouped(values, keys, root, xValue, xScale, groupScale) :
    ungrouped(values, root);

  const rect = groups
    .selectAll('rect')
    .data((datum) => {
      return datum;
    });

  const exit = plotExit(rect
    .exit()
    .transition(), graph.zoomed);

  exit.remove();

  const enter = rect
    .enter()
    .append('rect')
    .merge(rect);

  const minimize = plotExit(enter
    .transition(), graph.zoomed);

  const move = minimize
    .transition()
    .duration(0)
    .attr('class', (datum) => {
      return attrClass(datum, yValue, graph.size.height);
    })
    .attr('x', (datum, index) => {
      return attrX(datum, xValue, groupScale, index, isGrouped);
    })
    .attr('y', (datum) => {
      return plot.x === 'top' ?
        0 : attrY(datum, yValue, graph.size.height);
    })
    .attr('width', () => {
      return attrWidth(xScale, groupScale, isGrouped);
    })
    .attr('height', (datum) => {
      return attrHeight(datum, yValue, graph.size.height);
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
    root.classed('click', true);

    enter.on('click', (datum) => {
      if (enter.style('cursor') === 'pointer') {
        renderTip(graph, null, plot, format);
        plot.click(graph, structure, datum);
      }
    });
  }
}

function grouped(data, keys, root, xValue, xScale, groupScale) {
  const all = [];

  data.forEach((datum, datumIndex) => {
    keys.forEach((key, keyIndex) => {
      all[keyIndex] = all[keyIndex] || [];
      all[keyIndex][datumIndex] = datum[keyIndex];
    });
  });

  groupScale
    .domain(data.map((datum, index) => {
      return index;
    }))
    .range([0, attrWidth(xScale, groupScale)]);

  let groups = root
    .selectAll('g')
    .data(all);

  groups = groups
    .enter()
    .append('g')
    .merge(groups)
    .attr('transform', (datum) => {
      return 'translate(' + attrX(datum[0], xValue, groupScale) + ',0)';
    });

  return groups;
}

function ungrouped([data], root) {
  let groups = root
    .selectAll('g')
    .data([data]);

  groups = groups
    .enter()
    .append('g')
    .merge(groups);

  return groups;
}

function attrX(datum, xValue, groupScale, index, isGrouped = false) {
  return isGrouped === false ? xValue(datum) : groupScale(index);
}

function attrY(datum, yValue, height) {
  const barY = yValue(datum);
  return barY === height ? barY - 3 : barY;
}

function attrWidth(xScale, groupScale, isGrouped = false) {
  return isGrouped === false ? xScale.bandwidth() : groupScale.bandwidth();
}

function attrHeight(datum, yValue, height) {
  const barHeight = height - yValue(datum);
  return barHeight === 0 ? 3 : barHeight;
}

function attrClass(datum, yValue, height) {
  const barHeight = height - yValue(datum);
  return barHeight === 0 ? 'empty' : null;
}
