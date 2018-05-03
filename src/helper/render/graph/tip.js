import { event, select } from 'd3';

export default function renderTip(route, datum, plot, format) {
  select('.graph-tip').remove();

  if (datum === null) {
    return;
  }

  const tip = select('body')
    .append('div')
    .attr('class', 'graph-tip');

  plot.tip(route, tip, datum, format);

  const targetRect = event.target.getBoundingClientRect();
  const tipRect = tip.node().getBoundingClientRect();

  const left = targetRect.left +
    (targetRect.width / 2) -
    (tipRect.width / 2);

  const top = targetRect.top -
    tipRect.height;

  tip
    .style('top', top + 'px')
    .style('left', left + 'px')
    .style('width', tipRect.width + 'px')
    .style('height', tipRect.height + 'px');
}
