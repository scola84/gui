import { event, select } from 'd3';

export default function menu() {
  const body = select('body');

  body.on('touchstart', () => {
    body.dispatch('click', event);
  });

  body.on('click', () => {
    if (select(event.target).classed('show-menu')) {
      select('.menu')
        .classed('over', true)
        .on('touchstart', () => event.stopPropagation())
        .on('click', () => event.stopPropagation());
    } else {
      select('.menu.over')
        .classed('over', false)
        .on('touchstart', null)
        .on('click', null);
    }
  });
}
