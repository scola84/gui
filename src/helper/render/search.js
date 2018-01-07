export default function renderSearch(route, { panel, right }) {
  right
    .append('button')
    .attr('tabindex', 0)
    .classed('button icon ion-ios-search', true)
    .on('click', () => {
      panel.classed('search', () => {
        return !panel.classed('search');
      });

      panel
        .select('.search input')
        .node()
        .focus();
    });
}
