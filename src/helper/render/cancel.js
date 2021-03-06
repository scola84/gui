export default function renderCancel(route, { left, text }, handler) {
  const button = left
    .append('button')
    .attr('tabindex', 0)
    .attr('type', 'button')
    .classed('button left', true);

  if (route.remember === true) {
    button
      .text(text)
      .on('click', handler);
  } else {
    button
      .classed('icon show-menu ion-ios-menu-outline', true);
  }
}
