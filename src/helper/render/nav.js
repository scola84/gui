export default function renderNav(item, format) {
  item
    .classed('disabled', (datum) => datum.field.disabled);

  item
    .filter((datum) => typeof datum.field.icon !== 'undefined')
    .classed('icon', true)
    .append('span')
    .attr('class', (datum) => 'icon ' + datum.field.icon);

  const primary = item
    .append('div')
    .classed('primary', true);

  primary
    .append('button')
    .attr('tabindex', (datum) => datum.field.disabled ? -1 : 0)
    .attr('type', 'button')
    .text((d, i, n) => format(d, i, n, { name: 'nav.label' }));

  primary
    .append('span')
    .text((d, i, n) => format(d, i, n, { name: 'nav.sub' }));

  const secondary = item
    .append('div')
    .classed('secondary', true);

  secondary
    .append('span')
    .text((d, i, n) => format(d, i, n, { name: 'nav.value' }));

  secondary
    .filter((datum) => datum.field.dir === 'rtl')
    .append('span')
    .classed('icon ion-ios-arrow-forward', true);

  secondary
    .filter((datum) => typeof datum.field.button !== 'undefined')
    .append('button')
    .attr('class', (datum) => 'button ' + datum.field.button)
    .attr('tabindex', (datum) => datum.field.disabled ? -1 : 0)
    .attr('type', 'button');
}
