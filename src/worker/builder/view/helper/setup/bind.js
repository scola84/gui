import { select, event } from 'd3';
import fastclick from 'fastclick';

export function bind() {
  if (typeof window === 'undefined') {
    return;
  }

  const body = select('body');

  fastclick(body.node());

  body.on('touchstart', () => {
    body.dispatch('click', event);
  });

  body.on('click.scola-menu', () => {
    if (select(event.target).classed('show-menu')) {
      select('.app > .menu')
        .classed('transition', true)
        .classed('in', true)
        .on('touchstart', () => event.stopPropagation())
        .on('click', () => event.stopPropagation());
    } else {
      select('.app > .menu.in')
        .classed('in', false)
        .on('touchstart', null)
        .on('click', null);
    }
  });
}
