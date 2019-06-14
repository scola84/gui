import { select, event } from 'd3';
import fastclick from 'fastclick';

export default function bind() {
  const body = select('body');

  fastclick(body.node());

  body.on('touchstart', () => {
    body.dispatch('click', event);
  });

  body.on('click.scola-dom-menu', () => {
    if (select(event.target).classed('show-menu')) {
      select('.app > .menu')
        .classed('over', true)
        .on('touchstart', () => event.stopPropagation())
        .on('click', () => event.stopPropagation());
    } else {
      select('.app > .menu.over')
        .classed('over', false)
        .on('touchstart', null)
        .on('click', null);
    }
  });

  select('.app > .menu')
    .classed('over', true);
}
