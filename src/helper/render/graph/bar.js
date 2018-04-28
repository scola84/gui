export default function renderBar(route, values, keys, structure) {
  const groupScale = structure.axis.bottom.group();

  const xScale = route.graph.bottom.scale();
  const xValue = (datum) => structure.axis.bottom.value(datum, xScale);

  const yScale = route.graph.left.scale();
  const yValue = (datum) => structure.axis.left.value(datum, yScale);

  const g = route.graph.g
    .append('g')
    .classed('bar', true);

  const isGrouped = keys !== null;

  const groups = isGrouped === true ?
    grouped(values, keys, g, xValue, xScale, groupScale) :
    ungrouped(values, g);

  const bar = groups
    .selectAll('rect')
    .data((datum) => {
      return datum;
    });

  const exit = bar
    .exit()
    .transition();

  exit.remove();

  const enter = bar
    .enter()
    .append('rect')
    .merge(bar);

  const minimize = enter.transition();

  const move = minimize
    .transition()
    .duration(0)
    .attr('class', (datum) => {
      return attrClass(datum, yValue, route.graph.size.height);
    })
    .attr('x', (datum, index) => {
      return attrX(datum, xValue, groupScale, index, isGrouped);
    })
    .attr('y', (datum) => {
      return attrY(datum, yValue, route.graph.size.height);
    })
    .attr('width', () => {
      return attrWidth(xScale, groupScale, isGrouped);
    })
    .attr('height', (datum) => {
      return attrHeight(datum, yValue, route.graph.size.height);
    });

  move.transition();
}

function grouped(data, keys, g, xValue, xScale, groupScale) {
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

  let groups = g
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

function ungrouped(data, g) {
  let groups = g
    .selectAll('g')
    .data([data]);

  groups = groups
    .enter()
    .append('g')
    .merge(groups);

  return groups;
}

function attrX(datum, xValue, groupScale, index, isGrouped = false) {
  if (isGrouped === false) {
    return xValue(datum);
  }

  return groupScale(index);
}

function attrY(datum, yValue, height) {
  const barY = yValue(datum);
  return barY === height ? barY - 3 : barY;
}

function attrWidth(xScale, groupScale, isGrouped = false) {
  if (isGrouped === false) {
    return xScale.bandwidth();
  }

  return groupScale.bandwidth();
}

function attrHeight(datum, yValue, height) {
  const barHeight = height - yValue(datum);
  return barHeight === 0 ? 3 : barHeight;
}

function attrClass(datum, yValue, height) {
  const barHeight = height - yValue(datum);
  return barHeight === 0 ? 'empty' : null;
}
