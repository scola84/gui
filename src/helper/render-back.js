export default function renderBack(node, text, historic, handler) {
  const button = node
    .append('button')
    .attr('tabindex', 0)
    .classed('button left', true);

  if (historic === true) {
    button
      .classed('icon ion-ios-arrow-back', true)
      .text(text)
      .on('click', handler);
  } else {
    button
      .classed('show-menu ion-navicon', true);
  }
}
