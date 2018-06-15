import markdown from './markdown';

export default function renderKpi(item, format) {
  const primary = item
    .append('div')
    .classed('primary', true);

  const l0 = primary
    .append('div')
    .classed('l0', true);

  markdown(l0, 'l0', format);

  const line = primary
    .append('div')
    .classed('line', true);

  line
    .append('button')
    .attr('type', 'button')
    .classed('l1', true)
    .text((d, i, n) => format(d, i, n, 'l1'));

  const l4 = line
    .append('div')
    .classed('l4', true);

  markdown(l4, 'l4', format);

  const l2 = primary
    .append('div')
    .classed('l2', true);

  markdown(l2, 'l2', format);

  const l3 = primary
    .append('div')
    .classed('l3', true);

  markdown(l3, 'l3', format);

  const secondary = item
    .append('div')
    .classed('secondary', true);

  const l5 = secondary
    .append('div')
    .classed('l5', true);

  const value = l5
    .append('span')
    .classed('value', true);

  markdown(value, 'l5.value', format);

  const unit = l5
    .append('span')
    .classed('unit', true);

  markdown(unit, 'l5.unit', format);
}
