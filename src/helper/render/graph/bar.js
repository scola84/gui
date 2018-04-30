import renderTip from './tip';

export default function renderBar(route, values, keys, structure, plot) {
  const groupScale = structure.axis[plot.x].group();

  const xScale = route.graph.axis[plot.x].axis.scale();
  const xValue = (datum) => structure.axis[plot.x].value(datum, xScale);

  const yScale = route.graph.axis[plot.y].axis.scale();
  const yValue = (datum) => structure.axis[plot.y].value(datum, yScale);

  const root = route.graph.root
    .append('g')
    .classed('plot bar', true);

  const isGrouped = keys !== null;

  const groups = isGrouped === true ?
    grouped(values, keys, root, xValue, xScale, groupScale) :
    ungrouped(values, root);

  const rect = groups
    .selectAll('rect')
    .data((datum) => {
      return datum;
    })
    .enter()
    .append('rect')
    .attr('class', (datum) => {
      return attrClass(datum, yValue, route.graph.size.height);
    })
    .attr('x', (datum, index) => {
      return attrX(datum, xValue, groupScale, index, isGrouped);
    })
    .attr('y', (datum) => {
      return plot.x === 'top' ?
        0 : attrY(datum, yValue, route.graph.size.height);
    })
    .attr('width', () => {
      return attrWidth(xScale, groupScale, isGrouped);
    })
    .attr('height', (datum) => {
      return attrHeight(datum, yValue, route.graph.size.height);
    });

  if (plot.tip) {
    rect.on('mouseover', (datum) => {
      renderTip(route, datum, plot);
    });

    rect.on('mouseout', () => {
      renderTip(route, null, plot);
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

function ungrouped(data, root) {
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
