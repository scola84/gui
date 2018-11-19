import { event, select } from 'd3';

export default function setupMenu() {
  const body = select('body');

  body.on('touchstart', () => {
    body.dispatch('click', event);
  });

  body.on('click.scola-gui-menu', () => {
    if (select(event.target).classed('show-menu')) {
      select('.section.menu')
        .classed('over', true)
        .on('touchstart', () => event.stopPropagation())
        .on('click', () => event.stopPropagation());
    } else {
      select('.section.menu.over')
        .classed('over', false)
        .on('touchstart', null)
        .on('click', null);
    }
  });
}
