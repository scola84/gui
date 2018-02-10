export default function renderSearch(route, { panel, right }) {
  right
    .append('button')
    .attr('tabindex', 0)
    .classed('button icon search ion-ios-search', true)
    .on('click', () => {
      const show = !panel.classed('search');

      const input = panel
        .select('.search input')
        .node();

      panel
        .classed('immediate', false)
        .classed('search', show);

      if (show) {
        input.focus();
      } else {
        input.blur();
      }
    });
}
