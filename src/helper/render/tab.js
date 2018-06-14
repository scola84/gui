import { event, select } from 'd3';

export default function renderTab(node, items, options = {}) {
  const tab = node
    .append('ul')
    .classed('tab', true);

  let item = null;

  for (let i = 0; i < items.length; i += 1) {
    item = tab
      .append('li')
      .datum(items[i])
      .classed(items[i], true);

    item
      .append('button')
      .attr('tabindex', 0)
      .text((datum, index, nodes) => {
        return options.format(datum, index, nodes, items[i]);
      });
  }

  tab.on('click', () => {
    const selected = select(event.target.closest('li'));

    if (options.toggle === true) {
      if (options.multiple !== true) {
        const wasSelected = selected.classed('selected');
        tab.selectAll('li').classed('selected', false);
        selected.classed('selected', !wasSelected);
      } else {
        selected.classed('selected', () => {
          return !selected.classed('selected');
        });
      }
    } else {
      tab.selectAll('li').classed('selected', false);
      selected.classed('selected', true);
    }

    let detail = null;

    tab.selectAll('li').each((datum, index, nodes) => {
      if (select(nodes[index]).classed('selected')) {
        if (options.multiple !== true) {
          detail = items[index];
        } else {
          detail = detail || [];
          detail[detail.length] = items[index];
        }
      }
    });

    tab.dispatch('change', { detail });
  });

  return tab;
}
