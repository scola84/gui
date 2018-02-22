import { select } from 'd3';

export default function renderList(item, format) {
  item
    .attr('class', (datum) => datum.name)
    .classed('click', true)
    .classed('disabled', (datum) => datum.disabled);

  item
    .filter((datum) => typeof datum.icon !== 'undefined')
    .classed('icon', true)
    .append('span')
    .attr('class', (datum) => 'icon ' + datum.icon);

  const state = item
    .filter((datum) => typeof datum.state !== 'undefined')
    .append('div')
    .attr('class', (d, i, n) => 'state ' + format(d, i, n, 'state'));

  state.append('span');
  state.append('span');
  state.append('span');

  const primary = item
    .append('div')
    .classed('primary', true);

  primary
    .append('span')
    .classed('l0', true)
    .text((d, i, n) => format(d, i, n, 'l0'));

  const line = primary
    .append('span')
    .classed('line', true);

  line
    .append('button')
    .attr('tabindex', (datum) => datum.disabled ? -1 : 0)
    .attr('type', 'button')
    .classed('l1', true)
    .text((d, i, n) => format(d, i, n, 'l1'));

  line
    .append('span')
    .classed('l4', true)
    .text((d, i, n) => format(d, i, n, 'l4'));

  primary
    .append('span')
    .classed('l2', true)
    .text((d, i, n) => format(d, i, n, 'l2'));

  primary
    .append('span')
    .classed('l3', true)
    .html((d, i, n) => format(d, i, n, 'l3'));

  const secondary = item
    .append('div')
    .classed('secondary', true);

  secondary
    .append('span')
    .classed('l5', true)
    .text((d, i, n) => format(d, i, n, 'l5'));

  secondary
    .filter((datum) => {
      return datum.route &&
        datum.route.match(/:.*rtl/) &&
        typeof datum.button === 'undefined';
    })
    .append('span')
    .classed('icon ion-ios-arrow-forward', true);

  secondary
    .filter((datum) => typeof datum.button !== 'undefined')
    .append('button')
    .attr('class', (datum) => 'button ' + datum.button)
    .attr('tabindex', (datum) => datum.disabled ? -1 : 0)
    .attr('type', 'button');

  item
    .filter((datum, index, nodes) => {
      return select(nodes[index])
        .select('.l5:not(:empty)')
        .size() > 0;
    })
    .classed('secondary', true);
}
