export default function renderBack(route, { icon, left, text }, handler) {
  const button = left
    .append('button')
    .attr('tabindex', 0)
    .attr('type', 'button')
    .classed('button left', true);

  if (route.remember === true) {
    button
      .classed('icon ion-ios-arrow-back', icon)
      .text(text)
      .on('click', handler);
  } else {
    button
      .classed('show-menu ion-navicon', true);
  }
}