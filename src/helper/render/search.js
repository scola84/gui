export default function renderSearch(route, { panel, right }) {
  right
    .append('button')
    .attr('tabindex', 0)
    .classed('button icon search ion-ios-search-outline', true)
    .on('click', () => {
      const show = !panel.classed('show-search');

      const input = panel
        .select('.search input')
        .node();

      panel
        .classed('immediate', false)
        .classed('show-search', show)
        .classed('hide-search', !show);

      if (show) {
        input.focus();
      } else {
        input.blur();
      }
    });
}
