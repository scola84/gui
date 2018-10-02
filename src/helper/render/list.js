import { select } from 'd3';
import renderMarkdown from './markdown';

export default function renderList(item, format) {
  item
    .attr('class', (datum) => datum.name)
    .classed('click', true)
    .classed('disabled', (datum) => datum.disabled);

  item
    .append('span')
    .attr('class', 'number')
    .text((d, i, n) => format(d, i, n, 'number'));

  item
    .filter((datum, index, nodes) => {
      return select(nodes[index])
        .select('.number:not(:empty)')
        .size() > 0;
    })
    .classed('number', true);

  item
    .filter((datum) => typeof datum.icon !== 'undefined')
    .classed('icon', true)
    .append('span')
    .attr('class', (datum) => 'icon ' + datum.icon);

  const state = item
    .filter((datum) => typeof datum.state !== 'undefined')
    .append('div')
    .attr('class', (d, i, n) => 'states ' + format(d, i, n, 'state'));

  state.append('span');
  state.append('span');
  state.append('span');

  const primary = item
    .append('div')
    .classed('primary', true);

  const l0 = primary
    .append('div')
    .classed('l0', true);

  renderMarkdown(l0, 'l0', format);

  const line = primary
    .append('div')
    .classed('line', true);

  line
    .append('button')
    .attr('tabindex', (datum) => datum.disabled ? -1 : 0)
    .attr('type', 'button')
    .classed('l1', true)
    .text((d, i, n) => format(d, i, n, 'l1'));

  const l4 = line
    .append('div')
    .classed('l4', true);

  renderMarkdown(l4, 'l4', format);

  const l2 = primary
    .append('div')
    .classed('l2', true);

  renderMarkdown(l2, 'l2', format);

  const l3 = primary
    .append('div')
    .classed('l3', true);

  renderMarkdown(l3, 'l3', format);

  const secondary = item
    .append('div')
    .classed('secondary', true);

  const l5 = secondary
    .append('div')
    .classed('l5', true);

  renderMarkdown(l5, 'l5', format);

  secondary
    .filter((datum) => {
      return datum.route &&
        datum.route.match(/:.*rtl/) &&
        typeof datum.button === 'undefined';
    })
    .append('span')
    .classed('icon flip ion-ios-arrow-forward', true);

  secondary
    .selectAll('button')
    .data((datum) => Array.isArray(datum.actions) ? datum.actions : [])
    .enter()
    .append('button')
    .attr('class', (datum) => 'button ' + datum.button)
    .attr('tabindex', (datum) => datum.disabled ? -1 : 0)
    .attr('type', 'button');

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
