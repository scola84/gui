import { event } from 'd3';

export default class OrderInput {
  render(datum, index, node) {
    const input = node
      .classed('click', false)
      .select('.input');

    if (datum.empty) {
      input.remove();
    }

    input
      .attr('draggable', 'true')
      .append('span')
      .classed('drag', true)
      .append('span')
      .classed('handle ion-ios-drag', true)
      .on('click', () => {
        event.stopPropagation();
      });
  }
}
