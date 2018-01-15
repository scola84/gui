export default function renderNav(item, format) {
  item
    .classed('disabled', (datum) => datum.disabled);

  item
    .filter((datum) => typeof datum.icon !== 'undefined')
    .classed('icon', true)
    .append('span')
    .attr('class', (datum) => 'icon ' + datum.icon);

  const primary = item
    .append('div')
    .classed('primary', true);

  primary
    .append('button')
    .attr('tabindex', (datum) => datum.disabled ? -1 : 0)
    .attr('type', 'button')
    .text((d, i, n) => format(d, i, n, 'l1'));

  primary
    .append('span')
    .text((d, i, n) => format(d, i, n, 'l2'));

  const secondary = item
    .append('div')
    .classed('secondary', true);

  secondary
    .append('span')
    .text((d, i, n) => format(d, i, n, 'l3'));

  secondary
    .filter((datum) => datum.dir === 'rtl')
    .append('span')
    .classed('icon ion-ios-arrow-forward', true);

  secondary
    .filter((datum) => typeof datum.button !== 'undefined')
    .append('button')
    .attr('class', (datum) => 'button ' + datum.button)
    .attr('tabindex', (datum) => datum.disabled ? -1 : 0)
    .attr('type', 'button');
}
